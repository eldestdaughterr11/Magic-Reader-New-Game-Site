import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Data ─────────────────────────────────────────────── */

const GAMEPLAY_SLIDES = [
  { src: '/images/gameplay/challenge-a.png', title: 'House A — Letter Quest',   desc: 'Test letter recognition and vocabulary skills with Sherriff Sans!' },
  { src: '/images/gameplay/challenge-e.png', title: 'House E — Grammar Court',  desc: 'Master linking verbs and grammar under the watch of Judge Mental!' },
  { src: '/images/gameplay/challenge-i.png', title: 'House I — Word Workshop',  desc: 'Arrange scattered letters into words with Penny Cil!' },
  { src: '/images/gameplay/challenge-o.png', title: 'House O — Rhyme Garden',   desc: 'Listen to beats and find the rhyming words with Grandma Phonic!' },
  { src: '/images/gameplay/challenge-u.png', title: 'House U — Sound Library',  desc: 'Identify vowel sounds in scrambled audio with Connie Sonant!' },
];

const CHARACTERS = [
  { src: '/images/characters/penn-1.png',        name: 'Penn',           role: 'Male Lead' },
  { src: '/images/characters/paige-1.png',       name: 'Paige',          role: 'Female Lead' },
  { src: '/images/characters/guide-1.png',       name: 'Pip the Owl',    role: 'Your Guide' },
  { src: '/images/characters/archmage-1.png',    name: 'The Archmage',   role: 'Protector' },
  { src: '/images/characters/antagonist-1.png',  name: 'Miss Spell',     role: 'Antagonist' },
  { src: '/images/characters/syllabella-1.png',  name: 'Sylla Bella',    role: 'Mysterious' },
  { src: '/images/characters/sherriff-1.png',    name: 'Sherriff Sans',  role: 'House A' },
  { src: '/images/characters/judge-1.png',       name: 'Judge Mental',   role: 'House E' },
  { src: '/images/characters/penny-1.png',       name: 'Penny Cil',      role: 'House I' },
  { src: '/images/characters/grandma-1.png',     name: 'Grandma Phonic', role: 'House O' },
  { src: '/images/characters/connie-1.png',      name: 'Connie Sonant',  role: 'House U' },
];

/* ── Animated Counter ─────────────────────────────────── */

function AnimatedStat({ value, label, suffix = '', visible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let cur = 0;
    const interval = Math.max(40, Math.floor(1000 / value));
    const timer = setInterval(() => {
      cur += 1;
      setCount(cur);
      if (cur >= value) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div className="home-stat">
      <span className="home-stat__number">{count}{suffix}</span>
      <span className="home-stat__label">{label}</span>
    </div>
  );
}

/* ── Home Page ────────────────────────────────────────── */

function Home() {
  /* ── Gameplay carousel ── */
  const [gameSlide, setGameSlide] = useState(0);
  const gameTimer = useRef(null);

  const startGameTimer = () => {
    clearInterval(gameTimer.current);
    gameTimer.current = setInterval(() => {
      setGameSlide(prev => (prev + 1) % GAMEPLAY_SLIDES.length);
    }, 4500);
  };

  useEffect(() => {
    startGameTimer();
    return () => clearInterval(gameTimer.current);
  }, []);

  const goToGameSlide = (i) => { setGameSlide(i); startGameTimer(); };
  const prevGame = () => goToGameSlide((gameSlide - 1 + GAMEPLAY_SLIDES.length) % GAMEPLAY_SLIDES.length);
  const nextGame = () => goToGameSlide((gameSlide + 1) % GAMEPLAY_SLIDES.length);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('reveal--visible');
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Stats counter ── */
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) { setCountersVisible(true); obs.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Story expand ── */
  const [storyOpen, setStoryOpen] = useState(false);

  /* ── Sparkle positions (stable across renders) ── */
  const sparkles = useRef(
    Array.from({ length: 24 }, () => ({
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      dur:   `${3 + Math.random() * 4}s`,
    }))
  );

  return (
    <>
      {/* ════════════ HERO ════════════ */}
      <section className="home-hero">
        <div className="home-hero__bg">
          <img src="/images/poster.png" alt="" aria-hidden="true" />
        </div>
        <div className="home-hero__overlay" />

        {sparkles.current.map((s, i) => (
          <span
            key={i}
            className="home-hero__sparkle"
            style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}

        <div className="home-hero__content">
          <h1 className="home-hero__title">The Sound Keeper</h1>
          <p className="home-hero__subtitle">
            Embark on a magical reading adventure through Word Valley
          </p>
          <Link to="/game/download" className="home-hero__cta">
            <i className="fa-solid fa-gamepad" style={{ marginRight: '10px' }} />
            PLAY NOW
          </Link>
        </div>
      </section>

      {/* ════════════ TEASER VIDEO ════════════ */}
      <section className="reveal">
        <h2 className="section-title">Teaser Trailer</h2>
        <div className="video-container" style={{ background: 'transparent' }}>
          <video
            controls
            style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover' }}
          >
            <source src="/videos/teaser.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section className="home-features reveal">
        <h2 className="section-title">Why Play The Sound Keeper?</h2>
        <div className="home-features__grid">
          {[
            { icon: 'fa-solid fa-book-open-reader',     title: 'Educational',         desc: 'Master phonetics, grammar, vocabulary and vowel sounds through engaging challenges aligned with the MATATAG Curriculum.' },
            { icon: 'fa-solid fa-wand-magic-sparkles',   title: 'Magical World',       desc: 'Explore Word Valley — a vibrant realm of colorful letters, singing sounds, and enchanting characters waiting to guide you.' },
            { icon: 'fa-solid fa-puzzle-piece',          title: 'Multiple Game Modes', desc: 'Enjoy a mix of shooting games, puzzle solving, and platformer adventures with brainy educational tasks at every stage.' },
          ].map((f, i) => (
            <div key={i} className={`home-feature-card reveal reveal--delay-${i + 1}`}>
              <div className="home-feature-card__icon"><i className={f.icon} /></div>
              <h3 className="home-feature-card__title">{f.title}</h3>
              <p className="home-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section className="home-stats reveal" ref={statsRef}>
        <AnimatedStat value={5}  label="Vowel Stages"   visible={countersVisible} />
        <AnimatedStat value={10} label="Characters"      suffix="+" visible={countersVisible} />
        <AnimatedStat value={3}  label="Game Types"      visible={countersVisible} />
        <AnimatedStat value={5}  label="Town Governors"  visible={countersVisible} />
      </section>

      {/* ════════════ GAMEPLAY CAROUSEL ════════════ */}
      <section className="reveal" style={{ marginTop: '50px' }}>
        <h2 className="section-title">Gameplay Challenges</h2>
        <p className="sub-title">Explore the 5 Vowel Houses of Word Valley</p>

        <div className="home-carousel">
          <button className="home-carousel__arrow home-carousel__arrow--prev" onClick={prevGame} aria-label="Previous slide">
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div className="home-carousel__viewport">
            <div className="home-carousel__track" style={{ transform: `translateX(-${gameSlide * 100}%)` }}>
              {GAMEPLAY_SLIDES.map((s, i) => (
                <div key={i} className="home-carousel__slide">
                  <img src={s.src} alt={s.title} className="home-carousel__slide-img" />
                  <div className="home-carousel__slide-info">
                    <h3 className="home-carousel__slide-title">{s.title}</h3>
                    <p className="home-carousel__slide-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="home-carousel__arrow home-carousel__arrow--next" onClick={nextGame} aria-label="Next slide">
            <i className="fa-solid fa-chevron-right" />
          </button>

          <div className="home-carousel__dots">
            {GAMEPLAY_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`home-carousel__dot${i === gameSlide ? ' home-carousel__dot--active' : ''}`}
                onClick={() => goToGameSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CHARACTER SPOTLIGHT ════════════ */}
      <section className="reveal" style={{ marginTop: '50px' }}>
        <h2 className="section-title">Meet the Characters</h2>
        <p className="sub-title">The heroes and villains of Word Valley</p>

        <div className="home-chars__strip">
          {CHARACTERS.map((c, i) => (
            <Link to="/game/characters" key={i} className="home-char-card">
              <div className="home-char-card__img-wrap">
                <img src={c.src} alt={c.name} className="home-char-card__img" />
              </div>
              <h4 className="home-char-card__name">{c.name}</h4>
              <span className="home-char-card__role">{c.role}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════ STORY ════════════ */}
      <section className="reveal" style={{ marginTop: '50px' }}>
        <h2 className="section-title">The Story</h2>

        <div className={`home-story${storyOpen ? ' home-story--expanded' : ''}`}>
          <p>The story starts off with Penn (or Paige), who loves playing and learning, but when it comes to the English subject, they have trouble in learning and reading. When they say a word with phonetics or vowels in them, they become embarrassed due to them not being proficient. All of these are reasons why they go quiet and just wish the sounds were easier to understand.</p>

          <p>On a Monday morning, which is their examination day, they arrive at the classroom early, which is still empty. They tried to review their notes one last time, hoping it would help them understand the lessons better. The school bell rang, signaling that the exam would begin at any minute. Their hands felt cold as they held their pencil, wondering whether they&apos;ll get another low score. As the classroom becomes filled with students and their teacher, the examination starts. As they glanced down on their exam paper, they noticed a faint glow shining from beneath their desk. Curiously, they bent down and saw a colorful, shimmering book that hadn&apos;t been there before. Its cover read: &quot;The Sound Book&quot;, and they opened it. A bright light bursts from the book, surrounding them in a warm glow. They looked around the classroom mystified as everyone around was frozen in time, and before they knew it, they were pulled straight into the pages of the book.</p>

          <p>They land in Word Valley — a once beautiful place built from big, colorful letters and singing sounds. A guide called Pip, a wise owl, immediately comes down to greet you. Pip explains the world and the mission, an adventure that they need to do. What was once a bright and colorful world is being tormented by the &quot;mush-mush&quot; curse, inflicted by Miss Spell, the envious witch. The 5 houses: A, E, I, O, U and their vowel stones are sealed because of the curse, so the goal of the player is to recover the vowel stones and restore the world to its former glory.</p>

          <p>While adventuring, the valley will slowly be restored, and the player will encounter Miss Spell, in which they would have to defeat her to fully break the curse.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button className="home-story__toggle" onClick={() => setStoryOpen(!storyOpen)}>
            <i className={`fa-solid ${storyOpen ? 'fa-chevron-up' : 'fa-book-open'}`} style={{ marginRight: '8px' }} />
            {storyOpen ? 'Show Less' : 'Read Full Story'}
          </button>
        </div>
      </section>

      {/* ════════════ QR CODE ════════════ */}
      <div className="qr-code-section reveal">
        <h3 className="qr-code-title">📱 Scan the Survey</h3>
        <div className="qr-code-image-wrapper">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img src="/images/qrcode.png" alt="Scan QR Code for Survey" className="qr-code-image" />
          </a>
        </div>
        <p className="qr-code-description">
          Scan this QR code with your smartphone to access and answer our survey!
        </p>
      </div>

      {/* ════════════ FINAL CTA ════════════ */}
      <div className="reveal" style={{ textAlign: 'center', margin: '50px 0 40px' }}>
        <Link to="/game/download" className="home-hero__cta" style={{ display: 'inline-flex', animation: 'none', opacity: 1 }}>
          <i className="fa-solid fa-gamepad" style={{ marginRight: '10px' }} />
          START YOUR ADVENTURE
        </Link>
      </div>
    </>
  );
}

export default Home;
