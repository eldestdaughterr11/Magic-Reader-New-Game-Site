import { useState } from 'react';
import { Link } from 'react-router-dom';

function Gameplay() {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const openLightbox = (src) => {
    setLightboxSrc(src);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setLightboxSrc(null);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const floatingRunes = [
    { symbol: 'A', left: '6%', top: '16%', size: '2rem', delay: '0s', dur: '7s' },
    { symbol: 'E', left: '92%', top: '12%', size: '1.8rem', delay: '2s', dur: '8.5s' },
    { symbol: 'I', left: '4%', top: '48%', size: '1.6rem', delay: '1.2s', dur: '9s' },
    { symbol: 'O', left: '93%', top: '56%', size: '2.1rem', delay: '3s', dur: '7.8s' },
    { symbol: 'U', left: '7%', top: '80%', size: '1.8rem', delay: '2.2s', dur: '8.2s' },
    { symbol: '✦', left: '16%', top: '8%', size: '1.1rem', delay: '0.5s', dur: '6s' },
    { symbol: '✧', left: '85%', top: '32%', size: '1rem', delay: '3.8s', dur: '6.5s' },
    { symbol: '✦', left: '89%', top: '85%', size: '1.3rem', delay: '1.5s', dur: '7.2s' },
    { symbol: '✧', left: '12%', top: '36%', size: '1.1rem', delay: '2.8s', dur: '8s' },
  ];

  const challenges = [
    {
      letter: 'A',
      title: 'A Challenge: Letter Recognition',
      src: '/images/gameplay/challenge-a.png',
      alt: 'A Challenge Gameplay',
      desc: "In the A challenge, players will test their letter recognition and vocabulary skills. Hints will be given during cutscenes through Sheriff Sans' dialogue and with Pip's help."
    },
    {
      letter: 'E',
      title: 'E Challenge: Grammar & Verb Rules',
      src: '/images/gameplay/challenge-e.png',
      alt: 'E Challenge Gameplay',
      desc: "In the E challenge, players test their grammar skills. Pip will provide trivia related to verb rules to guide them."
    },
    {
      letter: 'I',
      title: 'I Challenge: Vocabulary & Encoding',
      src: '/images/gameplay/challenge-i.png',
      alt: 'I Challenge Gameplay',
      desc: "In the I challenge, players will test their vocabulary and encoding skills. Hints will be given during cutscenes through Penny Clix' dialogue and with Pip's help."
    },
    {
      letter: 'O',
      title: 'O Challenge: Phonetic Skills',
      src: '/images/gameplay/challenge-o.png',
      alt: 'O Challenge Gameplay',
      desc: "In the O challenge, players will test their phonetic skills. Hints will be given during cutscenes through Grandma Phonics' dialogue and with Pip's help."
    },
    {
      letter: 'U',
      title: 'U Challenge: Vowel Recognition',
      src: '/images/gameplay/challenge-u.png',
      alt: 'U Challenge Gameplay',
      desc: "In the U challenge, players will test their vowel recognition skills. Hints will be given on the book at each section of the challenge and with Pip's help."
    },
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

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#fff', position: 'relative', zIndex: 2 }}>
        
        {/* Sub Navigation */}
        <div className="game-subnav-container">
          <div className="game-subnav">
            <span className="game-subnav__current">
              <i className="fa-solid fa-gamepad" style={{ marginRight: '6px' }}></i>
              Gameplay
            </span>
            <Link to="/game/characters" className="game-subnav__link">
              <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i>
              Characters
            </Link>
            <Link to="/game/download" className="game-subnav__link game-subnav__link--download">
              <i className="fa-solid fa-download" style={{ marginRight: '6px' }}></i>
              Download
            </Link>
          </div>
        </div>

        {/* What is The Sound Keeper? */}
        <div className="gameplay-info-card" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.3rem', marginBottom: '18px', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            What is The Sound Keeper?
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', lineHeight: '1.75', maxWidth: '680px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.9)' }}>
            The Sound Keeper is an educational game that combines animation, puzzles, and storytelling. In this game, the player will encounter educational challenges as they progress through each stage of the map. The gameplay will consist of three types: <strong>Shooting game</strong>, <strong>Puzzle game</strong>, and a <strong>Platformer game</strong> with brainy tasks for learning, where you are on a quest to mend <em>Word Valley</em> wrecked by the villain named Miss Spell who stirred up total disorder.
          </p>
        </div>

        {/* How to Play */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.3rem', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
              How to Play
            </h2>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '6px' }}>
              Overcome each vowel trial through puzzle solving and phonics mastery
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {challenges.map((item) => (
              <div key={item.letter} className="gameplay-card responsive-flex-row" style={{ gap: '24px', alignItems: 'center' }}>
                <div 
                  className="gameplay-img-wrapper"
                  onClick={() => openLightbox(item.src)}
                  style={{ position: 'relative', cursor: 'zoom-in', flexShrink: 0 }}
                  title="Click to view enlarged"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="gameplay-challenge-img"
                  />
                  <span className="tap-to-enlarge-hint">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                    Tap to view
                  </span>
                </div>
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="gameplay-badge">
                    <span className="gameplay-badge__letter">{item.letter}</span>
                    <span>{item.title}</span>
                  </div>
                  <p style={{ maxWidth: '480px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="gameplay-info-card" style={{ marginBottom: '60px' }}>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.3rem', marginBottom: '25px', textAlign: 'center', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            Objectives
          </h2>
          
          <div className="responsive-flex-row" style={{ gap: '30px', alignItems: 'center' }}>
            <div 
              className="gameplay-img-wrapper"
              onClick={() => openLightbox('/images/gameplay/vowel-stones.png')}
              style={{ position: 'relative', cursor: 'zoom-in', flexShrink: 0 }}
              title="Click to view Vowel Stones"
            >
              <img 
                src="/images/gameplay/vowel-stones.png" 
                alt="Vowel Stones" 
                className="gameplay-challenge-img" 
                style={{ width: '220px', height: '220px', objectFit: 'contain' }}
              />
              <span className="tap-to-enlarge-hint">
                <i className="fa-solid fa-magnifying-glass-plus"></i>
                Tap to view
              </span>
            </div>
            <div style={{ flex: '1', fontFamily: 'Montserrat, sans-serif', fontSize: '0.92rem', textAlign: 'left', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.92)' }}>
              <p style={{ marginBottom: '14px' }}>
                The main objective of the game is to restore <strong>Word Valley</strong> and defeat <em>Miss Spell</em> through the <strong>Ritual of Restoration</strong>. The game concludes with a test of knowledge instead of combat. After recovering all five Vowel Stones, the player must return to the plaza to perform the Ritual of Restoration.
              </p>
              
              <div style={{ 
                background: 'rgba(212, 133, 74, 0.12)', 
                borderLeft: '4px solid #d4854a', 
                borderRadius: '8px', 
                padding: '12px 18px', 
                marginBottom: '14px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                <strong style={{ color: '#f5e6d3', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
                  ✨ The Vowel Chant:
                </strong>
                <span style={{ fontStyle: 'italic', color: '#fff', fontSize: '0.95rem' }}>
                  &ldquo;To keep Word Valley bright and loud, I AIM high, and EVERYONE can try, my voice is my OWN, facing the great UNKNOWN.&rdquo;
                </span>
              </div>
              
              <p style={{ margin: 0 }}>
                Completing this chant creates a radiant light that counters the curse. Miss Spell is left defeated but offered to stay in Word Valley as it is restored to its full brilliance.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: '60px' }}>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.3rem', marginBottom: '25px', textAlign: 'center', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            Controls
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="controls-card-wrapper">
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                <thead>
                  <tr style={{ background: 'rgba(212, 133, 74, 0.2)' }}>
                    <th style={{ padding: '14px', borderBottom: '2px solid rgba(224, 195, 252, 0.2)', color: '#f5e6d3', fontWeight: '700', letterSpacing: '0.05em' }}>Keystrokes</th>
                    <th style={{ padding: '14px', borderBottom: '2px solid rgba(224, 195, 252, 0.2)', color: '#f5e6d3', fontWeight: '700', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['W', 'Move Forward'], ['A', 'Move Left'], ['S', 'Move Backward'], ['D', 'Move Right'],
                    ['Spacebar', 'Jump'], ['Left Mouse Button', 'Interaction (Puzzles)'],
                    ['Mouse', 'Look Around'], ['E', 'Interact with NPCs'],
                    ['Esc', 'Menu / Pause'], ['Left Shift', 'Sprint'],
                  ].map(([key, action], idx) => (
                    <tr key={key} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <kbd className="keycap">{key}</kbd>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.9)' }}>
                        {action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxSrc && (
          <div
            onClick={closeLightbox}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              cursor: 'zoom-out',
              padding: '20px'
            }}
          >
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute', top: '20px', right: '24px',
                background: 'none', border: 'none', color: '#fff',
                fontSize: '2rem', cursor: 'pointer', lineHeight: 1,
                zIndex: 2001
              }}
            >✕</button>
            
            <div 
              style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '10px',
                boxShadow: '0 0 40px rgba(0,0,0,0.9)',
                maxWidth: '90vw',
                maxHeight: '80vh',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxSrc}
                alt="Full view"
                onClick={toggleZoom}
                onMouseMove={handleMouseMove}
                style={{
                  display: 'block',
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                  transition: isZoomed ? 'none' : 'transform 0.3s ease, transform-origin 0.3s ease',
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`
                }}
              />
            </div>
            
            <p style={{ 
              color: '#e8c97c', 
              marginTop: '15px', 
              fontFamily: 'Montserrat, sans-serif', 
              fontSize: '0.85rem', 
              textAlign: 'center',
              pointerEvents: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
            }}>
              <i className="fa-solid fa-magnifying-glass" style={{ marginRight: '6px' }}></i>
              {isZoomed ? "Move mouse to explore details. Click image to Zoom Out." : "Click image to Zoom In & inspect details."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Gameplay;
