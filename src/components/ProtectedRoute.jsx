import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function ProtectedRoute({ children, requireAdmin = false }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Error fetching user role", err);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show a simple loading screen while checking if the user is logged in
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#2d1b2e', 
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <h2>Loading Magic Reader...</h2>
      </div>
    );
  }

  // If no user is logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If page requires Admin but user is NOT an admin, kick them to Home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // If logged in (and passes admin check if required), allow them to view the page
  return children;
}

export default ProtectedRoute;
