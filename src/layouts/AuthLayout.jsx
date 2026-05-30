import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function AuthLayout() {
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  return (
    <>
      <header className="auth-header">
        <div className="dots" style={{ visibility: 'hidden' }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="logo-text-centered">
          <Link to="/home" className="logo-link">
            <img
              src="/images/magic-reader-logo.png"
              alt="Magic Reader"
              className="logo-img"
            />
          </Link>
        </div>
        <div style={{ visibility: 'hidden', fontSize: '2.5rem' }}>
          <i className="fa-regular fa-circle-user"></i>
        </div>
      </header>

      <main className="auth-main">
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

export default AuthLayout;
