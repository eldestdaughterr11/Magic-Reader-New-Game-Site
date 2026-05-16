import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1 className="section-title">Teaser Video</h1>
      
      <div className="video-container">
        <div className="play-button">
          <i className="fa-solid fa-play" style={{ fontSize: '2rem', color: '#3d2b4f' }}></i>
        </div>
        {/* Progress bar simulation */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', height: '10px', background: 'rgba(255,255,255,0.3)', borderRadius: '5px' }}>
          <div style={{ width: '40%', height: '100%', background: 'var(--accent-color)', borderRadius: '5px' }}></div>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: '50px' }}>Story</h2>
      
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
        <p>The story starts off with Penn (or Paige), who loves playing and learning, but when it comes to the English subject, they have trouble in learning and reading. When they say a word with phonetics or vowels in them, they become embarrassed due to them not being proficient. All of these are reasons why they go quiet and just wish the sounds were easier to understand.</p>
        
        <br />
        
        <p>On a Monday morning, which is their examination day, they arrive at the classroom early, which is still empty. They tried to review their noted one last time, hoping it would help them understand the lessons better. The school bell rang, signaling that the exam would begin at any minute. Their hands felt cold as they held their pencil, wondering whether they'll get another low score. As the classroom becomes filled with students and their teacher, the examination starts. As they glanced down on their exam paper, they noticed a faint glow shining from beneath their desk. Curiously, they bent down and saw a colorful, shimmering book that hadn't been there before. Its cover read: "The Sound Book", and they opened it. A bright light bursts from the book, surrounding them in a warm glow. They looked around the classroom mystified as everyone around was frozen in time, and before they knew it, they were pulled straight into the pages of the book.</p>
        
        <br />
        
        <p>They land in Word Valley—a once beautiful place built from big, colorful letters and singing sounds. A guide called Pip, a wise owl, immediately comes down to greet you. Pip explains the world and the mission, an adventure that they need to do. What was once a bright and colorful world is being tormented by the "mush-mush" curse, inflicted by Miss Spell, the envious witch. The 5 houses: A, E, I, O, U and their vowel stones are sealed because of the curse, so the goal of the player is to recover the vowel stones and restore the world to its former glory.</p>
        
        <br />
        
        <p>While adventuring, the valley will slowly be restored, and the player will encounter Miss Spell, in which they would have to defeat her to fully break the curse.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <Link to="/game/gameplay" className="btn" style={{ padding: '15px 60px' }}>PLAY NOW</Link>
      </div>
    </>
  );
}

export default Home;
