import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Animated Stat Component (Moved from Home) ────────── */
function AnimatedStat({ value, label, suffix = '', visible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const interval = Math.max(35, Math.floor(1000 / value));
    const timer = setInterval(() => {
      cur += 1;
      setCount(cur);
      if (cur >= value) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div className="char-stat-card">
      <span className="char-stat-number">{count}{suffix}</span>
      <span className="char-stat-label">{label}</span>
    </div>
  );
}

function Characters() {
  const [failedImages, setFailedImages] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxSrc, setLightboxSrc] = useState(null);

  /* ── Stats visibility observer ── */
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setCountersVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const floatingRunes = [
    { symbol: 'A', left: '5%', top: '12%', size: '2.1rem', delay: '0s', dur: '7.5s' },
    { symbol: 'E', left: '92%', top: '15%', size: '1.9rem', delay: '2s', dur: '8s' },
    { symbol: 'I', left: '4%', top: '44%', size: '1.7rem', delay: '1s', dur: '9s' },
    { symbol: 'O', left: '94%', top: '52%', size: '2.2rem', delay: '3.2s', dur: '7.6s' },
    { symbol: 'U', left: '6%', top: '82%', size: '1.8rem', delay: '2.4s', dur: '8.4s' },
    { symbol: '✦', left: '14%', top: '6%', size: '1.1rem', delay: '0.6s', dur: '6.2s' },
    { symbol: '✧', left: '86%', top: '34%', size: '1rem', delay: '3.5s', dur: '6.8s' },
    { symbol: '✦', left: '88%', top: '88%', size: '1.3rem', delay: '1.8s', dur: '7s' },
    { symbol: '✧', left: '10%', top: '30%', size: '1.1rem', delay: '2.5s', dur: '7.9s' },
  ];

  const charData = [
    {
      name: "Penn",
      category: "Leads",
      role: "Lead Protagonist",
      badge: "Male Lead",
      desc: "The male lead student who is jolly and enjoys playing with his classmates, but is silent because he struggles with reading words and sentences.",
      sprites: [
        "/images/characters/penn-1.png",
        "/images/characters/penn-2.png"
      ]
    },
    {
      name: "Paige",
      category: "Leads",
      role: "Lead Protagonist",
      badge: "Female Lead",
      desc: "The female lead student who loves hanging with her friends, but hates attending English class because she struggles with reading words and sentences.",
      sprites: [
        "/images/characters/paige-1.png",
        "/images/characters/paige-2.png"
      ]
    },
    {
      name: "Pip the Owl",
      category: "NPCs",
      role: "Guide & Mayor",
      badge: "Tutorial Guide",
      desc: "Pip is the Mayor of Word Valley and appears as a magical owl. He acts as a guide and tutorial system, offering wisdom and clues to help you navigate each trial.",
      sprites: [
        "/images/characters/guide-1.png",
        "/images/characters/guide-2.png",
        "/images/characters/guide-3.png"
      ]
    },
    {
      name: "The Archmage",
      category: "NPCs",
      role: "Protector & Guardian",
      badge: "Protector",
      desc: "The powerful mage who serves as Word Valley's protector and guardian. She was cursed and transformed into an owl by Miss Spell, revealed when the curse is broken.",
      sprites: [
        "/images/characters/archmage-1.png",
        "/images/characters/archmage-2.png",
        "/images/characters/archmage-3.png",
        "/images/characters/archmage-4.png"
      ]
    },
    {
      name: "Miss Spell",
      category: "Antagonist",
      role: "The Envious Witch",
      badge: "Main Antagonist",
      desc: "Miss Spell is the cursed form of Word Valley. Driven by frustration and envy because her letters were scattered, she cast the 'mush-mush' curse to seal the vowel stones.",
      sprites: [
        "/images/characters/antagonist-1.png",
        "/images/characters/antagonist-2.png",
        "/images/characters/antagonist-3.png",
        "/images/characters/antagonist-4.png"
      ]
    },
    {
      name: "Sylla Bella",
      category: "Antagonist",
      role: "Mysterious Inhabitant",
      badge: "Mysterious NPC",
      desc: "Sylla Bella is a mysterious NPC who appears at the end of the game, reuniting the Vowel Book from Penn or Paige, and bearing a striking resemblance to Miss Spell.",
      sprites: [
        "/images/characters/syllabella-1.png"
      ]
    },
    {
      name: "Sherriff Sans",
      category: "Governors",
      role: "Governor of House A",
      badge: "House A Governor",
      desc: "Governs House 'A'. In his visual challenge, players pick up fragmented letter parts and fit them into correct slots to test letter recognition and formation.",
      sprites: [
        "/images/characters/sherriff-1.png"
      ]
    },
    {
      name: "Judge Mental",
      category: "Governors",
      role: "Governor of House E",
      badge: "House E Governor",
      desc: "Governs House 'E'. In his court challenge, players inspect incomplete scroll sentences and use the magic wand to pick the correct linking verbs (is, are).",
      sprites: [
        "/images/characters/judge-1.png"
      ]
    },
    {
      name: "Penny Cil",
      category: "Governors",
      role: "Governor of House I",
      badge: "House I Governor",
      desc: "Manages House 'I'. This word workshop tests encoding and spelling. Players retrieve scattered letters and assemble them in sequence to form valid words.",
      sprites: [
        "/images/characters/penny-1.png"
      ]
    },
    {
      name: "Grandma Phonic",
      category: "Governors",
      role: "Governor of House O",
      badge: "House O Governor",
      desc: "Governs House 'O'. In this musical garden challenge, players listen to rhythmic beats and select rhyming words to complete the song lyrics.",
      sprites: [
        "/images/characters/grandma-1.png"
      ]
    },
    {
      name: "Connie Sonant",
      category: "Governors",
      role: "Governor of House U",
      badge: "House U Governor",
      desc: "Directs House 'U' within a chaotic sound library. Players listen to scrambled audio clips and identify the target vowel sounds.",
      sprites: [
        "/images/characters/connie-1.png"
      ]
    },
    {
      name: "Teacher & Classmates",
      category: "NPCs",
      role: "Real World Classmates",
      badge: "Classroom NPC",
      desc: "Teachers and students appearing in intro and outro story cutscenes to portray the real-world classroom before the journey into The Sound Book.",
      sprites: [
        "/images/characters/teacher-1.png"
      ]
    }
  ];

  const categories = [
    { id: 'All', label: 'All Characters', count: charData.length },
    { id: 'Leads', label: 'Lead Heroes', count: 2 },
    { id: 'Governors', label: 'Town Governors', count: 5 },
    { id: 'NPCs', label: 'Guides & Allies', count: 3 },
    { id: 'Antagonist', label: 'Antagonists', count: 2 },
  ];

  const filteredCharacters = activeCategory === 'All' 
    ? charData 
    : charData.filter(c => c.category === activeCategory);

  const handleImageError = (charIndex, spriteIndex) => {
    setFailedImages(prev => ({
      ...prev,
      [`${charIndex}-${spriteIndex}`]: true
    }));
  };

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
            <span className="game-subnav__current">
              <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i>
              Characters
            </span>
            <Link to="/game/download" className="game-subnav__link game-subnav__link--download">
              <i className="fa-solid fa-download" style={{ marginRight: '6px' }}></i>
              Download
            </Link>
          </div>
        </div>

        {/* ════════════ STATS BANNER (Moved from Home) ════════════ */}
        <div className="char-stats-wrapper" ref={statsRef}>
          <div className="char-stats-grid">
            <AnimatedStat value={5}  label="Vowel Stages"   visible={countersVisible} />
            <AnimatedStat value={10} label="Characters"      suffix="+" visible={countersVisible} />
            <AnimatedStat value={3}  label="Game Types"      visible={countersVisible} />
            <AnimatedStat value={5}  label="Town Governors"  visible={countersVisible} />
          </div>
        </div>

        {/* Section Header */}
        <div className="gameplay-info-card" style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.3rem', marginBottom: '12px', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            Meet the Characters
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.98rem', lineHeight: '1.7', maxWidth: '650px', margin: '0 auto', color: 'rgba(255, 255, 255, 0.88)' }}>
            From adventurous students to wise mentors and eccentric town governors, discover all the inhabitants of Word Valley.
          </p>

          {/* Category Filter Pills */}
          <div className="char-filter-tabs">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`char-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                <span className="char-filter-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Character Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredCharacters.map((char, charIndex) => (
            <div key={char.name} className="gameplay-card char-card-layout">
              {/* Left: Sprites Showcase */}
              <div className="char-sprites-gallery">
                {char.sprites.map((spritePath, spriteIndex) => {
                  const imgKey = `${charIndex}-${spriteIndex}`;
                  const isMissing = failedImages[imgKey];
                  return (
                    <div 
                      key={spriteIndex} 
                      className="char-sprite-frame gameplay-img-wrapper"
                      onClick={() => !isMissing && setLightboxSrc(spritePath)}
                      title="Tap to enlarge"
                    >
                      {!isMissing ? (
                        <img 
                          src={spritePath} 
                          alt={`${char.name} sprite ${spriteIndex + 1}`}
                          className="char-sprite-img"
                          onError={() => handleImageError(charIndex, spriteIndex)}
                        />
                      ) : (
                        <div className="char-sprite-fallback">
                          <i className="fa-solid fa-user-astronaut"></i>
                        </div>
                      )}
                      <span className="tap-to-enlarge-hint">
                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Info / Description */}
              <div className="char-info-col">
                <div className="char-header-row">
                  <div>
                    <span className="gameplay-badge" style={{ marginBottom: '6px' }}>
                      <span className="gameplay-badge__letter">✦</span>
                      <span>{char.badge}</span>
                    </span>
                    <h3 className="char-name-title">{char.name}</h3>
                  </div>
                  <span className="char-role-tag">{char.role}</span>
                </div>

                <p className="char-description-text">
                  {char.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxSrc} alt="Enlarged Character" className="lightbox-image" />
            <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Characters;
