import { Link, Outlet } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function AuthLayout() {
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const sparkles = useRef(
    Array.from({ length: 24 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      dur: `${3 + Math.random() * 4}s`,
    }))
  );

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
              src="/images/sound-keeper-logo.png"
              alt="The Sound Keeper"
              className="logo-img"
            />
          </Link>
        </div>
        <div style={{ visibility: 'hidden', fontSize: '2.5rem' }}>
          <i className="fa-regular fa-circle-user"></i>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-hero__bg">
          <img src="/images/the-sound-keeper-bg.jpg" alt="" aria-hidden="true" />
        </div>
        <div className="auth-hero__overlay" />

        {sparkles.current.map((s, i) => (
          <span
            key={i}
            className="home-hero__sparkle"
            style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}

        <Outlet />
      </main>

      <footer className="auth-footer">
        <div className="auth-footer__inner">
          <Link to="/home" className="logo-link">
            <img
              src="/images/sound-keeper-logo.png"
              alt="The Sound Keeper"
              className="logo-img footer-logo"
            />
          </Link>
          <p className="copyright">© 2026 Dream Pixels. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default AuthLayout;
