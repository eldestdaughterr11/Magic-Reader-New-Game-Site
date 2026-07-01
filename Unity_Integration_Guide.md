# Magic Reader Unity Integration Guide

This guide explains how to connect your Unity game to the **Magic Reader** web database (Firebase).

## 1. Backend Architecture Overview
The web application does not run on a traditional PHP or Node.js backend server. Instead, it is **Serverless** and runs on **Google Firebase**:
*   **Firebase Authentication**: Stores and manages student/admin user credentials.
*   **Firebase Firestore**: A NoSQL cloud database storing:
    *   `users` collection: Tracks each user's profile (`name`, `email`, `role`, `score`, `createdAt`).
    *   `activities` collection: Logs real-time actions (like new high scores or logins) for the website's Admin Dashboard.
    *   `user_logs` collection: Maintains full authentication history.

---

## 2. Firebase Configurations
Here are the configuration keys retrieved from the website config (firebase.js):

*   **Firebase Project ID**: `magic-reader-ea738`
*   **Web API Key**: `AIzaSyC3RVHw2zwA2rJsewn1pkyTvitetGi7soI`

---

## 3. Unity Integration Scripts

To connect Unity without installing heavy SDK libraries or encountering WebGL compatibility bugs, we use **Firebase REST APIs** via Unity's built-in `UnityWebRequest`. This runs perfectly on all platforms (WebGL, Android, iOS, Windows, Mac).

### C# Script: `FirebaseManager.cs`
Create a C# script named `FirebaseManager.cs` in your Unity project and paste this code:

```csharp
using System;
using System.Text;
using System.Collections;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.Networking;

public class FirebaseManager : MonoBehaviour
{
    public static FirebaseManager Instance { get; private set; }

    [Header("Firebase Config")]
    private string apiKey = "AIzaSyC3RVHw2zwA2rJsewn1pkyTvitetGi7soI";
    private string projectId = "magic-reader-ea738";

    [Header("Session State")]
    public string localId = ""; // User Auth UID
    public string idToken = ""; // JWT Token for Firestore authentication
    public string email = "";
    public string playerName = "";
    public int currentScore = 0;
    public string role = "student";

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    #region Helper structures
    [System.Serializable]
    private class AuthRequestData
    {
        public string email;
        public string password;
        public bool returnSecureToken = true;
    }

    [System.Serializable]
    private class AuthResponseData
    {
        public string idToken;
        public string email;
        public string refreshToken;
        public string expiresIn;
        public string localId;
    }
    #endregion

    #region Firebase Auth Methods

    /// <summary>
    /// Log in an existing user with email and password.
    /// </summary>
    public void Login(string userEmail, string userPassword, Action<bool, string> callback)
    {
        StartCoroutine(LoginCoroutine(userEmail, userPassword, callback));
    }

    private IEnumerator LoginCoroutine(string userEmail, string userPassword, Action<bool, string> callback)
    {
        string url = $"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={apiKey}";
        
        AuthRequestData requestData = new AuthRequestData { email = userEmail, password = userPassword };
        string jsonPayload = JsonUtility.ToJson(requestData);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                AuthResponseData response = JsonUtility.FromJson<AuthResponseData>(request.downloadHandler.text);
                idToken = response.idToken;
                localId = response.localId;
                email = response.email;

                // Log login activity to Firestore
                StartCoroutine(LogUserActivity(email, "Login from Unity"));

                // Fetch student stats and name from Firestore
                FetchUserData((success, message) => {
                    callback(success, success ? "Login & data fetch successful!" : "Login OK, but failed to fetch user data: " + message);
                });
            }
            else
            {
                callback(false, GetErrorDetail(request.downloadHandler.text));
            }
        }
    }

    /// <summary>
    /// Register a new student account.
    /// </summary>
    public void Register(string displayName, string userEmail, string userPassword, Action<bool, string> callback)
    {
        StartCoroutine(RegisterCoroutine(displayName, userEmail, userPassword, callback));
    }

    private IEnumerator RegisterCoroutine(string displayName, string userEmail, string userPassword, Action<bool, string> callback)
    {
        string url = $"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={apiKey}";

        AuthRequestData requestData = new AuthRequestData { email = userEmail, password = userPassword };
        string jsonPayload = JsonUtility.ToJson(requestData);

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                AuthResponseData response = JsonUtility.FromJson<AuthResponseData>(request.downloadHandler.text);
                idToken = response.idToken;
                localId = response.localId;
                email = response.email;
                playerName = displayName;
                currentScore = 0;
                role = email.ToLower().Contains("admin") ? "admin" : "student";

                // Create Firestore user profile
                StartCoroutine(CreateFirestoreUserProfile(displayName, email, role, (profileSuccess, profileError) => {
                    if (profileSuccess)
                    {
                        StartCoroutine(LogUserActivity(displayName, "Registered New Account from Unity"));
                        callback(true, "Registration successful!");
                    }
                    else
                    {
                        callback(false, "Auth created but failed to initialize profile: " + profileError);
                    }
                }));
            }
            else
            {
                callback(false, GetErrorDetail(request.downloadHandler.text));
            }
        }
    }

    #endregion

    #region Firestore Database Methods

    /// <summary>
    /// Fetches user details (Name, Score, Role) from Firestore.
    /// </summary>
    public void FetchUserData(Action<bool, string> callback)
    {
        StartCoroutine(FetchUserDataCoroutine(callback));
    }

    private IEnumerator FetchUserDataCoroutine(Action<bool, string> callback)
    {
        string url = $"https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/users/{localId}";

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.SetRequestHeader("Authorization", $"Bearer {idToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string jsonResponse = request.downloadHandler.text;

                // Extract fields using Regex to avoid importing complex JSON parsing libraries in Unity
                playerName = GetJsonField(jsonResponse, "name", "stringValue");
                string scoreStr = GetJsonField(jsonResponse, "score", "integerValue");
                int.TryParse(scoreStr, out currentScore);
                role = GetJsonField(jsonResponse, "role", "stringValue");

                callback(true, "User data successfully retrieved.");
            }
            else
            {
                callback(false, "Failed to retrieve user data: " + request.error);
            }
        }
    }

    /// <summary>
    /// Submits a new score. It will only update if the new score is HIGHER than the current score (matches web app rules).
    /// </summary>
    public void SubmitScore(int newScore, Action<bool, string> callback)
    {
        if (newScore <= currentScore)
        {
            callback(false, "Submitted score is not higher than your current high score!");
            return;
        }

        StartCoroutine(SubmitScoreCoroutine(newScore, callback));
    }

    private IEnumerator SubmitScoreCoroutine(int newScore, Action<bool, string> callback)
    {
        string url = $"https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/users/{localId}?updateMask.fieldPaths=score&updateMask.fieldPaths=lastScoreUpdated&key={apiKey}";

        // Format body according to Google Firestore API standards
        string isoTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        string jsonPayload = "{" +
            "\"fields\": {" +
                "\"score\": {\"integerValue\": \"" + newScore + "\"}," +
                "\"lastScoreUpdated\": {\"stringValue\": \"" + isoTime + "\"}" +
            "}" +
        "}";

        using (UnityWebRequest request = new UnityWebRequest(url, "PATCH"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {idToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                currentScore = newScore;
                
                // Log score activity so it displays on the Web Admin Dashboard immediately
                string activityMsg = $"Submitted New High Score from Unity: {newScore}";
                StartCoroutine(LogUserActivity(playerName, activityMsg));

                callback(true, "Score submitted successfully!");
            }
            else
            {
                callback(false, "Failed to submit score: " + request.error);
            }
        }
    }

    private IEnumerator CreateFirestoreUserProfile(string name, string email, string role, Action<bool, string> callback)
    {
        string url = $"https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/users/{localId}?key={apiKey}";

        string isoTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        string jsonPayload = "{" +
            "\"fields\": {" +
                "\"name\": {\"stringValue\": \"" + name + "\"}," +
                "\"email\": {\"stringValue\": \"" + email + "\"}," +
                "\"role\": {\"stringValue\": \"" + role + "\"}," +
                "\"score\": {\"integerValue\": \"0\"}," +
                "\"createdAt\": {\"stringValue\": \"" + isoTime + "\"}" +
            "}" +
        "}";

        using (UnityWebRequest request = new UnityWebRequest(url, "PATCH"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {idToken}");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                callback(true, "");
            }
            else
            {
                callback(false, request.error);
            }
        }
    }

    private IEnumerator LogUserActivity(string userIdent, string actionMessage)
    {
        string url = $"https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/activities?key={apiKey}";

        string isoTime = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
        string jsonPayload = "{" +
            "\"fields\": {" +
                "\"action\": {\"stringValue\": \"" + actionMessage + "\"}," +
                "\"user\": {\"stringValue\": \"" + userIdent + "\"}," +
                "\"timestamp\": {\"stringValue\": \"" + isoTime + "\"}" +
            "}" +
        "}";

        using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonPayload);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Authorization", $"Bearer {idToken}");

            yield return request.SendWebRequest();
            // Fire and forget
        }
    }

    #endregion

    #region Achievement Rank Calculator

    public struct Achievement
    {
        public string Title;
        public string Color; // Hex representation
        public string Icon;
    }

    /// <summary>
    /// Evaluates the achievement rank based on the score (matches web frontend configurations).
    /// </summary>
    public Achievement GetAchievement(int score)
    {
        if (score >= 5000) return new Achievement { Title = "Word Master", Color = "#FFD700", Icon = "👑" };
        if (score >= 4000) return new Achievement { Title = "Fast Solver", Color = "#C0C0C0", Icon = "⚡" };
        if (score >= 3000) return new Achievement { Title = "Minigames Fanatic", Color = "#CD7F32", Icon = "🎮" };
        if (score >= 2000) return new Achievement { Title = "Grammar Wizard", Color = "#E0C3FC", Icon = "🔮" };
        if (score >= 1000) return new Achievement { Title = "Spelling Bee", Color = "#E8C97C", Icon = "🐝" };
        return new Achievement { Title = "Beginner Reader", Color = "#AAAAAA", Icon = "📖" };
    }

    #endregion

    #region Helper Parsers

    private string GetJsonField(string json, string fieldName, string valType)
    {
        string pattern = $"\"{fieldName}\"\\s*:\\s*\\{{\\s*\"{valType}\"\\s*:\\s*\"([^\"]+)\"";
        Match match = Regex.Match(json, pattern);
        if (match.Success)
        {
            return match.Groups[1].Value;
        }
        return "";
    }

    private string GetErrorDetail(string errorJson)
    {
        Match match = Regex.Match(errorJson, "\"message\"\\s*:\\s*\"([^\"]+)\"");
        if (match.Success)
        {
            return match.Groups[1].Value;
        }
        return "Unknown error. Check Firebase configuration.";
    }

    #endregion
}
```

---

## 4. How to Use the Scripts inside Unity

### Step A: Set up Manager in Unity
1. Create an empty GameObject in your scene called `FirebaseManager`.
2. Attach the `FirebaseManager` script to it.

### Step B: Example Controller
Create a C# Script called `PlayerStatsController.cs` to test operations:

```csharp
using UnityEngine;

public class PlayerStatsController : MonoBehaviour
{
    [Header("Testing Inputs")]
    public string email = "student@gmail.com";
    public string password = "password123";
    public string studentName = "Jose Rizal";
    public int newGameScore = 1200;

    [ContextMenu("Test Registration")]
    public void TestRegister()
    {
        Debug.Log("Registering account...");
        FirebaseManager.Instance.Register(studentName, email, password, (success, msg) => {
            Debug.Log($"Register status: {success}. Details: {msg}");
        });
    }

    [ContextMenu("Test Login")]
    public void TestLogin()
    {
        Debug.Log("Logging in...");
        FirebaseManager.Instance.Login(email, password, (success, msg) => {
            Debug.Log($"Login status: {success}. Details: {msg}");
            if (success)
            {
                DisplayProfile();
            }
        });
    }

    [ContextMenu("Test Submit Score")]
    public void TestSubmitScore()
    {
        Debug.Log($"Submitting score: {newGameScore}");
        FirebaseManager.Instance.SubmitScore(newGameScore, (success, msg) => {
            Debug.Log($"Submit Score status: {success}. Details: {msg}");
            if (success)
            {
                DisplayProfile();
            }
        });
    }

    private void DisplayProfile()
    {
        FirebaseManager fm = FirebaseManager.Instance;
        FirebaseManager.Achievement rank = fm.GetAchievement(fm.currentScore);
        
        Debug.Log("===================================");
        Debug.Log($"WELCOME BACK, {fm.playerName} ({fm.email})");
        Debug.Log($"CURRENT SCORE: {fm.currentScore}");
        Debug.Log($"ACHIEVEMENT RANK: {rank.Icon} {rank.Title} (Color: {rank.Color})");
        Debug.Log("===================================");
    }
}
```

Attach `PlayerStatsController` to any object in Unity. Right-click the component inside the Inspector to trigger the test functions (`Test Registration`, `Test Login`, `Test Submit Score`) using the Unity Context Menu!
