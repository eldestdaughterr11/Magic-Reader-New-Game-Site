const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Callable Cloud Function: deleteUser
 * Permanently deletes a user from Firebase Authentication AND Firestore.
 * Only callable by authenticated admin users.
 */
exports.deleteUser = functions.https.onCall(async (data, context) => {
  // 1. Check that the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to perform this action."
    );
  }

  // 2. Check that the caller is an admin
  const callerDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (!callerDoc.exists || callerDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can delete user accounts."
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "A valid user UID is required."
    );
  }

  // 3. Delete from Firebase Authentication
  try {
    await admin.auth().deleteUser(uid);
  } catch (err) {
    // If user doesn't exist in Auth, we can still clean up Firestore
    if (err.code !== "auth/user-not-found") {
      throw new functions.https.HttpsError(
        "internal",
        `Failed to delete user from Auth: ${err.message}`
      );
    }
  }

  // 4. Delete from Firestore users collection
  await admin.firestore().collection("users").doc(uid).delete();

  // 5. Log the deletion in activities
  await admin.firestore().collection("activities").add({
    action: "Account Deleted",
    user: data.email || uid,
    timestamp: new Date().toISOString(),
  });

  return { success: true, message: `User ${uid} has been permanently deleted.` };
});
