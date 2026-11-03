import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <>
      <header>
        <Link to="/home" className="logo-link" onClick={() => setIsMenuOpen(false)}>
          <img
            src="/images/sound-keeper-logo.png"
            alt="The Sound Keeper"
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
            to="/resources"
            className={currentPath.includes('/resources') ? 'active' : ''}
          >
            Resources
          </Link>
          <Link
            to="/forum"
            className={currentPath.includes('/forum') ? 'active' : ''}
          >
            Forum
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
            to="/resources"
            className={currentPath.includes('/resources') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Resources
          </Link>
          <Link
            to="/forum"
            className={currentPath.includes('/forum') ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            Forum
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

      <main className="container fade-in">
        <Outlet />
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/home" className="logo-link">
              <img
                src="/images/sound-keeper-logo.png"
                alt="The Sound Keeper"
                className="logo-img footer-logo"
              />
            </Link>
            <p style={{ marginTop: '10px', fontSize: '1.05rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>
              Explore, Learn, and Play with Words!
            </p>
          </div>
          <div className="footer-col">
            <h4>
              <Link to="/home">Navigation</Link>
            </h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/home"><i className="fa-solid fa-house" style={{ marginRight: '8px' }}></i>Home</Link>
              </li>
              <li>
                <Link to="/game/gameplay"><i className="fa-solid fa-gamepad" style={{ marginRight: '8px' }}></i>Game</Link>
              </li>
              <li>
                <Link to="/resources"><i className="fa-solid fa-book" style={{ marginRight: '8px' }}></i>Resources</Link>
              </li>
              <li>
                <Link to="/forum"><i className="fa-solid fa-comments" style={{ marginRight: '8px' }}></i>Forum</Link>
              </li>
              <li>
                <Link to="/about"><i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>About</Link>
              </li>
              <li>
                <Link to="/contact"><i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i>Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>
              <Link to="/resources">Resources</Link>
            </h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/resources?category=Vocabulary Guide"><i className="fa-solid fa-spell-check" style={{ marginRight: '8px' }}></i>Vocabulary Guide</Link>
              </li>
              <li>
                <Link to="/resources?category=Grammar Tips"><i className="fa-solid fa-pen-nib" style={{ marginRight: '8px' }}></i>Grammar Tips</Link>
              </li>
              <li>
                <Link to="/resources?category=Practice Exercises"><i className="fa-solid fa-clipboard-question" style={{ marginRight: '8px' }}></i>Practice Exercises</Link>
              </li>
              <li>
                <Link to="/resources?category=Reading Nook"><i className="fa-solid fa-book-open" style={{ marginRight: '8px' }}></i>Reading Nook</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-contact">
            <h4>
              <Link to="/contact">Contact Us</Link>
            </h4>
            <ul className="footer-nav-list">
              <li>
                <a href="mailto:dreampixels2026@gmail.com" className="footer-email-chip">
                  <i className="fa-solid fa-envelope" style={{ marginRight: '8px' }}></i>
                  dreampixels2026@gmail.com
                </a>
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
