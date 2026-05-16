import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function MainLayout() {
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
    <>
      <div className="top-bar">
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <header>
        <Link to="/home" className="logo-link">
          <img
            src="/images/magic-reader-logo.png"
            alt="Magic Reader"
            className="logo-img"
          />
        </Link>
        <nav className="nav-links">
          <Link to="/home" className={currentPath === '/home' ? 'active' : ''}>
            Home
          </Link>
          <Link
            to="/game/gameplay"
            className={currentPath.includes('/game') ? 'active' : ''}
          >
            Game
          </Link>
          <Link
            to="/leaderboards"
            className={currentPath.includes('/leaderboards') ? 'active' : ''}
          >
            Leaderboards
          </Link>
          <Link
            to="/resources"
            className={currentPath.includes('/resources') ? 'active' : ''}
          >
            Resources
          </Link>
          <Link
            to="/about"
            className={currentPath.includes('/about') ? 'active' : ''}
          >
            About
          </Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/login" className="user-profile" title="Login / Sign Up">
            <i className="fa-regular fa-circle-user"></i>
          </Link>
          <button 
            onClick={handleLogout} 
            style={{
              background: 'transparent', 
              border: '1px solid #fff', 
              color: '#fff', 
              padding: '5px 15px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Log Out
          </button>
        </div>
      </header>
      <div className="header-bottom-bar"></div>

      <main className="container fade-in">
        <Outlet />
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/home" className="logo-link">
              <img
                src="/images/magic-reader-logo.png"
                alt="Magic Reader"
                className="logo-img footer-logo"
              />
            </Link>
            <p style={{ marginTop: '10px' }}>
              Explore, Learn, and Play with Words!
            </p>
          </div>
          <div className="footer-col">
            <h4>
              <Link to="/home">Navigation</Link>
            </h4>
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/game/gameplay">Game</Link>
              </li>
              <li>
                <Link to="/leaderboards">Leaderboards</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>
              <Link to="/resources">Resources</Link>
            </h4>
            <ul>
              <li>
                <a href="/resources#guides">Guides</a>
              </li>
              <li>
                <a href="/resources#tips">Tips</a>
              </li>
              <li>
                <a href="/resources#lessons">Lessons</a>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-contact">
            <h4>
              <a href="/about#contact">Contact</a>
            </h4>
            <ul>
              <li>
                <a href="mailto:support@gamename.com">Email</a>
              </li>
              <li>
                <a href="/about#social">Social Media</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="copyright">© 2026 Dream Pixels. All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default MainLayout;
