import { Link } from 'react-router-dom';

function Download() {
  const floatingRunes = [
    { symbol: 'A', left: '6%', top: '14%', size: '2rem', delay: '0s', dur: '7.2s' },
    { symbol: 'E', left: '91%', top: '16%', size: '1.8rem', delay: '1.8s', dur: '8.2s' },
    { symbol: 'I', left: '5%', top: '46%', size: '1.6rem', delay: '1.2s', dur: '8.8s' },
    { symbol: 'O', left: '93%', top: '54%', size: '2.1rem', delay: '3.1s', dur: '7.5s' },
    { symbol: 'U', left: '7%', top: '80%', size: '1.8rem', delay: '2.3s', dur: '8.3s' },
    { symbol: '✦', left: '15%', top: '8%', size: '1.1rem', delay: '0.5s', dur: '6s' },
    { symbol: '✧', left: '85%', top: '32%', size: '1rem', delay: '3.8s', dur: '6.5s' },
    { symbol: '✦', left: '89%', top: '85%', size: '1.3rem', delay: '1.5s', dur: '7.2s' },
    { symbol: '✧', left: '12%', top: '36%', size: '1.1rem', delay: '2.8s', dur: '8s' },
  ];

  const installSteps = [
    {
      step: '01',
      icon: 'fa-solid fa-cloud-arrow-down',
      title: 'Download Game Package',
      desc: 'Click the Download button to open our official Google Drive folder and save the game files.'
    },
    {
      step: '02',
      icon: 'fa-solid fa-file-zipper',
      title: 'Extract Files',
      desc: 'Unzip the downloaded archive to your preferred folder on your Windows PC (e.g., Desktop or Games).'
    },
    {
      step: '03',
      icon: 'fa-solid fa-gamepad',
      title: 'Launch & Play',
      desc: 'Open the extracted folder, double click TheSoundKeeper.exe, and start your quest in Word Valley!'
    }
  ];

  const sysReqs = [
    { label: 'Operating System', val: 'Windows 10 / 11 (64-bit)' },
    { label: 'Processor', val: 'Intel Core i3 / AMD Ryzen 3 or higher' },
    { label: 'Memory', val: '4 GB RAM' },
    { label: 'Storage', val: 'Approx. 500 MB free disk space' },
    { label: 'Audio', val: 'Standard stereo speakers or headphones' },
    { label: 'Controls', val: 'Keyboard & Mouse' },
  ];

  return (
    <div className="page-bg page-bg--game">
      {/* Floating Magical Vowel Runes */}
      {floatingRunes.map((item, idx) => (
        <span
          key={idx}
          className="game-floating-rune"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.dur,
          }}
          aria-hidden="true"
        >
          {item.symbol}
        </span>
      ))}

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px 60px', color: '#fff', position: 'relative', zIndex: 2 }}>
        
        {/* Pill Sub Navigation matching Gameplay */}
        <div className="game-subnav-container">
          <div className="game-subnav">
            <Link to="/game/gameplay" className="game-subnav__link">
              <i className="fa-solid fa-gamepad" style={{ marginRight: '6px' }}></i>
              Gameplay
            </Link>
            <Link to="/game/characters" className="game-subnav__link">
              <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i>
              Characters
            </Link>
            <span className="game-subnav__current game-subnav__current--download">
              <i className="fa-solid fa-download" style={{ marginRight: '6px' }}></i>
              Download
            </span>
          </div>
        </div>

        {/* ════════════ MAIN DOWNLOAD HERO CARD ════════════ */}
        <div className="gameplay-info-card download-hero-card">
          <div className="download-hero-grid">
            
            {/* Left: 3D Poster Presentation */}
            <div className="download-poster-wrapper">
              <div className="download-poster-frame">
                <img 
                  src="/images/poster.png" 
                  alt="The Sound Keeper Game Poster" 
                  className="download-poster-img"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://via.placeholder.com/400x600/2a1a3d/ffffff?text=The+Sound+Keeper"
                  }}
                />
                <div className="download-poster-shine"></div>
              </div>
            </div>

            {/* Right: Game Info & Download CTA */}
            <div className="download-details-col">
              <span className="gameplay-badge" style={{ marginBottom: '12px' }}>
                <span className="gameplay-badge__letter">✦</span>
                <span>PC Edition Available</span>
              </span>

              <h2 className="download-game-title">
                The Sound Keeper
              </h2>
              <p className="download-game-subtitle">
                A Magical Educational Phonics & Vowel Adventure
              </p>

              <p className="download-game-desc">
                Embark on an enchanting journey through Word Valley. Solve phonetics puzzles, collect Vowel Stones, and help Penn and Paige restore the magic of language. Aligned with the DepEd MATATAG Grade 3 English curriculum.
              </p>

              {/* Badges / Chips */}
              <div className="download-chips-row">
                <span className="download-chip">
                  <i className="fa-brands fa-windows" style={{ color: '#00d2ff' }}></i>
                  Windows PC
                </span>
                <span className="download-chip">
                  <i className="fa-solid fa-certificate" style={{ color: '#f5c518' }}></i>
                  MATATAG Grade 3
                </span>
                <span className="download-chip">
                  <i className="fa-solid fa-shield-halved" style={{ color: '#2ecc71' }}></i>
                  Virus-Free Verified
                </span>
                <span className="download-chip">
                  <i className="fa-solid fa-gift" style={{ color: '#ebb8f5' }}></i>
                  Free Educational Game
                </span>
              </div>

              {/* Big CTA Button */}
              <div style={{ marginTop: '28px' }}>
                <a 
                  href="https://drive.google.com/drive/folders/1TVxBa-lYOGH7Hs8zswWkypXnR8f9avxn?usp=drive_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-action-btn"
                >
                  <i className="fa-solid fa-cloud-arrow-down download-btn-icon"></i>
                  <div className="download-btn-text">
                    <span className="download-btn-main">DOWNLOAD NOW</span>
                    <span className="download-btn-sub">Official Google Drive Folder</span>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ════════════ INSTALLATION GUIDE ════════════ */}
        <div style={{ marginTop: '50px', marginBottom: '50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.1rem', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
              How to Install
            </h2>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '6px' }}>
              Simple 3-step setup to launch The Sound Keeper on your computer
            </p>
          </div>

          <div className="download-steps-grid">
            {installSteps.map((s) => (
              <div key={s.step} className="gameplay-card download-step-card">
                <div className="download-step-header">
                  <div className="download-step-icon">
                    <i className={s.icon}></i>
                  </div>
                  <span className="download-step-number">{s.step}</span>
                </div>
                <h3 className="download-step-title">{s.title}</h3>
                <p className="download-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════ SYSTEM REQUIREMENTS ════════════ */}
        <div className="gameplay-info-card" style={{ marginBottom: '30px' }}>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.1rem', marginBottom: '22px', textAlign: 'center', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            System Requirements
          </h2>

          <div className="download-sys-table-wrapper">
            <table className="download-sys-table">
              <tbody>
                {sysReqs.map((req, i) => (
                  <tr key={i} className="download-sys-row">
                    <td className="download-sys-label">
                      <i className="fa-solid fa-angle-right" style={{ color: '#d4854a', marginRight: '8px' }}></i>
                      {req.label}
                    </td>
                    <td className="download-sys-value">{req.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Download;
