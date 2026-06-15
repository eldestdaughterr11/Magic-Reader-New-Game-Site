import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, addDoc, collection } from 'firebase/firestore';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save user profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
        score: 0,
        createdAt: new Date().toISOString()
      });

      // 3. Log this action to the Real-time Recent Activity table
      await addDoc(collection(db, 'activities'), {
        action: 'Registered New Account',
        user: name,
        timestamp: new Date().toISOString()
      });

      // 4. Log to detailed user_logs in the database
      await addDoc(collection(db, 'user_logs'), {
        userId: user.uid,
        email: email,
        name: name,
        action: 'Signup',
        timestamp: new Date().toISOString()
      });

      alert('Account created successfully!');
      navigate('/login'); // Redirect to login
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1 className="auth-title">Create New Account</h1>
        <p className="auth-subtitle">
          Already Registered? <Link to="/login" className="auth-link">Login</Link>
        </p>

        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength="6"
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button type="submit" className="btn btn-block" disabled={loading}>
              {loading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
