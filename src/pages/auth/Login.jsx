import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user document exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userName = email;
      let isAdmin = false;

      if (!userDocSnap.exists()) {
        // Firestore document is missing — auto-create it so user can still log in
        const { setDoc } = await import('firebase/firestore');
        const newUserData = {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          role: 'student',
          isBanned: false,
          createdAt: new Date().toISOString(),
          restoredAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUserData);
        userName = newUserData.name;
        isAdmin = false;
      } else {
        const userData = userDocSnap.data();

        if (userData.isBanned) {
          await signOut(auth);
          setError('Your account has been banned. Please contact support.');
          setLoading(false);
          return;
        }

        userName = userData.name || email;
        isAdmin = userData.role === 'admin';
      }

      // Log to activities for the real-time Admin Dashboard
      await addDoc(collection(db, 'activities'), {
        action: 'Logged In',
        user: userName,
        timestamp: new Date().toISOString()
      });

      // Log to detailed user_logs database history
      await addDoc(collection(db, 'user_logs'), {
        userId: user.uid,
        email: user.email,
        name: userName,
        action: 'Login',
        timestamp: new Date().toISOString()
      });

      alert('Login successful!');

      if (isAdmin) {
        navigate('/admin'); // Redirect admins to dashboard
      } else {
        navigate('/home'); // Redirect students to home
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">
          Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>

        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="youremail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button type="submit" className="btn btn-block" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
