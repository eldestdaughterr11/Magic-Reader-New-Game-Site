import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
      
      // Check if user is admin
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      alert('Login successful!');

      if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
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
