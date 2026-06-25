import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import './Admin.css';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        let userName = user.email;
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userName = userDoc.data().name || user.email;
          }
        } catch (e) {
          console.error("Error fetching user name on logout:", e);
        }

        // Log to activities for Admin Dashboard
        await addDoc(collection(db, 'activities'), {
          action: 'Logged Out',
          user: userName,
          timestamp: new Date().toISOString()
        });

        // Log to detailed user_logs database history
        await addDoc(collection(db, 'user_logs'), {
          userId: user.uid,
          email: user.email,
          name: userName,
          action: 'Logout',
          timestamp: new Date().toISOString()
        });
      }
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      {/* Mobile Sidebar Overlay Backdrop */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <h2>CMS Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={currentPath === '/admin' ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-gauge"></i> Dashboard
          </Link>
          <Link to="/admin/lessons" className={currentPath.includes('/admin/lessons') ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-book"></i> Lessons
          </Link>
          <Link to="/admin/users" className={currentPath.includes('/admin/users') ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-users"></i> Users
          </Link>
          <Link to="/admin/forums" className={currentPath.includes('/admin/forums') ? 'active' : ''} onClick={() => setIsSidebarOpen(false)}>
            <i className="fa-solid fa-comments"></i> Forums
          </Link>
        </nav>
        <div className="admin-logout">
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              handleLogout();
            }} 
            className="btn-logout" 
            style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer', padding: '10px 20px', width: '100%', textAlign: 'left', fontSize: '1rem'}}
          >
            <i className="fa-solid fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Hamburger Button for Admin mobile */}
            <button 
              className="admin-menu-btn" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle admin menu"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 style={{ margin: 0 }}>Content Management</h1>
          </div>
          <div className="admin-profile">
            <span>Admin User</span>
            <i className="fa-regular fa-circle-user"></i>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
