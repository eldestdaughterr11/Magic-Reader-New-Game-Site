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
          role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
          isBanned: false,
          createdAt: new Date().toISOString(),
          restoredAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUserData);
        userName = newUserData.name;
        isAdmin = newUserData.role === 'admin';
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
      
      // Auto-create admin account on the fly if it doesn't exist yet in Firebase
      if (email.toLowerCase().includes('admin') && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
        try {
          const { createUserWithEmailAndPassword } = await import('firebase/auth');
          const { setDoc } = await import('firebase/firestore');
          
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const newUser = userCredential.user;
          
          const userDocRef = doc(db, 'users', newUser.uid);
          await setDoc(userDocRef, {
            name: email.split('@')[0].toUpperCase(),
            email: email,
            role: 'admin',
            isBanned: false,
            createdAt: new Date().toISOString()
          });

          await addDoc(collection(db, 'activities'), {
            action: 'Logged In (Auto-created)',
            user: email.split('@')[0].toUpperCase(),
            timestamp: new Date().toISOString()
          });

          alert('Admin account created and logged in successfully!');
          navigate('/admin');
          return;
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-exists') {
            setError('Invalid email or password.');
          } else {
            console.error(createErr);
            setError('Error: ' + createErr.message);
          }
          return;
        }
      }

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

        <div style={{ backgroundColor: 'rgba(212, 133, 74, 0.15)', border: '1px solid #d4854a', borderRadius: '8px', padding: '10px', marginBottom: '15px', color: '#fff', fontSize: '0.85rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
          💡 <strong>Need Admin Access?</strong><br />
          Just go to <strong>Sign Up</strong> and register an email containing <u>admin</u> (e.g. <code>admin2@example.com</code>) to automatically get Admin rights!
        </div>

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
