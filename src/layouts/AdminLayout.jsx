import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Admin.css';

function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>CMS Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={currentPath === '/admin' ? 'active' : ''}>
            <i className="fa-solid fa-gauge"></i> Dashboard
          </Link>
          <Link to="/admin/lessons" className={currentPath.includes('/admin/lessons') ? 'active' : ''}>
            <i className="fa-solid fa-book"></i> Lessons
          </Link>
          <Link to="/admin/users" className={currentPath.includes('/admin/users') ? 'active' : ''}>
            <i className="fa-solid fa-users"></i> Users
          </Link>
        </nav>
        <div className="admin-logout">
          <button onClick={handleLogout} className="btn-logout" style={{background:'transparent', border:'none', color:'#fff', cursor:'pointer', padding: '10px 20px', width: '100%', textAlign: 'left', fontSize: '1rem'}}>
            <i className="fa-solid fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>Content Management System</h1>
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
