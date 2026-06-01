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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      {/* Sub Navigation */}
      <div className="game-subnav">
        <span className="game-subnav__current">Gameplay</span>
        <Link to="/game/characters" className="game-subnav__link">Characters</Link>
        <Link to="/game/download" className="game-subnav__link">Download</Link>
      </div>

      {/* What is The Sound Keeper? */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '15px' }}>What is The Sound Keeper?</h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          The Sound Keeper is an educational game that combines animation, puzzles, and storytelling. In this game, the player will encounter educational challenges as they progress through each stage of the map. The gameplay will consist of three types; Shooting game, Puzzle Game, and a Platformer Game with brainy tasks for learning, where you are on a hunt, a mission to mend "Word Valley" wrecked by this villain named Miss Spell who stirred up total disorder.
        </p>
      </div>

      {/* How to Play */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '30px' }}>How to Play</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {[
            { src: '/images/gameplay/challenge-a.png', alt: 'A Challenge Gameplay', desc: "In the A challenge, players will test their letter recognition and vocabulary skills. Hints will be given during cutscenes through Sheriff Sans' dialogue and with Pip's help." },
            { src: '/images/gameplay/challenge-e.png', alt: 'E Challenge Gameplay', desc: "In the E challenge, players test their grammar skills. Pip will provide trivia related to verb rules to guide them." },
            { src: '/images/gameplay/challenge-i.png', alt: 'I Challenge Gameplay', desc: "In the I challenge, players will test their vocabulary and encoding skills. Hints will be given during cutscenes through Penny Clix' dialogue and with Pip's help." },
            { src: '/images/gameplay/challenge-o.png', alt: 'O Challenge Gameplay', desc: "In the O challenge, players will test their phonetic skills. Hints will be given during cutscenes through Grandma Phonics' dialogue and with Pip's help." },
            { src: '/images/gameplay/challenge-u.png', alt: 'U Challenge Gameplay', desc: "In the U challenge, players will test their vowel recognition skills. Hints will be given on the book at each section of the challenge and with Pip's help." },
          ].map((item) => (
            <div key={item.src} className="responsive-flex-row" style={{ gap: '20px' }}>
              <div 
                className="gameplay-img-wrapper"
                onClick={() => openLightbox(item.src)}
                style={{ position: 'relative', cursor: 'zoom-in', flexShrink: 0 }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="gameplay-challenge-img"
                />
                <span className="tap-to-enlarge-hint">
                  <i className="fa-solid fa-magnifying-glass-plus" style={{ marginRight: '4px' }}></i>
                  Tap to view
                </span>
              </div>
              <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
                {item.desc}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Objectives */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '30px' }}>Objectives</h2>
        
        <div className="responsive-flex-row" style={{ gap: '30px' }}>
          <div 
            className="gameplay-img-wrapper"
            onClick={() => openLightbox('/images/gameplay/vowel-stones.png')}
            style={{ position: 'relative', cursor: 'zoom-in', flexShrink: 0 }}
          >
            <img 
              src="/images/gameplay/vowel-stones.png" 
              alt="Vowel Stones" 
              className="gameplay-challenge-img" 
              style={{ width: '220px', height: '220px', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
            <span className="tap-to-enlarge-hint">
              <i className="fa-solid fa-magnifying-glass-plus" style={{ marginRight: '4px' }}></i>
              Tap to view
            </span>
          </div>
          <div style={{ flex: '1', maxWidth: '500px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', textAlign: 'center', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '15px' }}>The main objective of the game is to restore Word Valley and defeat Miss Spell through the Ritual of Restoration. The game concludes with a test of knowledge instead of combat. After recovering all five Vowel Stones, the player must return to the plaza to perform the Ritual of Restoration. The player must complete the sentence and perform the following chant:</p>
            
            <p style={{ marginBottom: '15px' }}><strong>The Vowel Chant:</strong><br/>
            "To keep Word Valley bright and loud, I AIM high, and EVERYONE can try, my voice is my OWN, facing the great UNKNOWN."</p>
            
            <p>Completing this chant creates a radiant light that counters the curse. Miss Spell is left defeated but would be offered to stay in Word Valley, while it's restored to its full color.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '30px' }}>Controls</h2>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="scrollable-wrapper" style={{ margin: 0, maxWidth: '550px', width: '100%' }}>
            <table style={{ 
              width: '100%', 
              minWidth: '400px',
              borderCollapse: 'collapse', 
              backgroundColor: '#f5e6d3', 
              color: '#3d2b4f',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.85rem',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', border: '1px solid #d1a7d1', borderBottom: '2px solid #3d2b4f' }}>Keystrokes</th>
                  <th style={{ padding: '12px', border: '1px solid #d1a7d1', borderBottom: '2px solid #3d2b4f' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['W', 'Move Forward'], ['A', 'Move Left'], ['S', 'Move Backward'], ['D', 'Move Right'],
                  ['Spacebar', 'Jump'], ['Left Mouse Button', 'Interaction (Puzzles)'],
                  ['Mouse', 'Look Around'], ['E', 'Interact with NPCs'],
                  ['Esc', 'Menu/Pause'], ['Left Shift', 'Sprint'],
                ].map(([key, action]) => (
                  <tr key={key}>
                    <td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>{key}</td>
                    <td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>{action}</td>
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
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                mixBlendMode: lightboxSrc === '/images/gameplay/vowel-stones.png' ? 'screen' : 'normal'
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
  );
}

export default Gameplay;
