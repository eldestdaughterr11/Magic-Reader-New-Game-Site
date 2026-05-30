import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <Link to="/home" className="logo-link" onClick={() => setIsMenuOpen(false)}>
          <img
            src="/images/magic-reader-logo.png"
            alt="Magic Reader"
            className="logo-img"
          />
        </Link>

        {/* Mobile Hamburger toggle button */}
        <button 
          className="menu-toggle-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <i className={isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>

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
          <Link
            to="/contact"
            className={currentPath.includes('/contact') ? 'active' : ''}
          >
            Contact
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

      {/* Mobile Navigation Backdrop Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Navigation Slide-out Drawer */}
      <div className={`mobile-nav-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-drawer-links">
          <Link to="/home" className={currentPath === '/home' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/game/gameplay"
            className={currentPath.includes('/game') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Game
          </Link>
          <Link
            to="/leaderboards"
            className={currentPath.includes('/leaderboards') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Leaderboards
          </Link>
          <Link
            to="/resources"
            className={currentPath.includes('/resources') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Resources
          </Link>
          <Link
            to="/about"
            className={currentPath.includes('/about') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={currentPath.includes('/contact') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
        <div className="mobile-nav-drawer-actions">
          <Link to="/login" className="user-profile" title="Login / Sign Up" onClick={() => setIsMenuOpen(false)}>
            <i className="fa-regular fa-circle-user"></i>
          </Link>
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }} 
            style={{
              background: 'transparent', 
              border: '1px solid #fff', 
              color: '#fff', 
              padding: '10px 15px', 
              borderRadius: '20px', 
              cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Log Out
          </button>
        </div>
      </div>

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
            <p style={{ marginTop: '10px', fontSize: '1.1rem', fontWeight: '500' }}>
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
                <Link to="/resources?category=Vocabulary Guide">Vocabulary Guide</Link>
              </li>
              <li>
                <Link to="/resources?category=Grammar Tips">Grammar Tips</Link>
              </li>
              <li>
                <Link to="/resources?category=Practice Exercises">Practice Exercises</Link>
              </li>
              <li>
                <Link to="/resources?category=Reading Nook">Reading Nook</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-contact">
            <h4>
              <Link to="/contact">Contact Us</Link>
            </h4>
            <ul>
              <li>
                <a href="mailto:support.dreampixels@gmail.com">support.dreampixels@gmail.com</a>
              </li>
              <li>
                <Link to="/contact">Social Media</Link>
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
