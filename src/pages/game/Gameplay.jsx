import { Link } from 'react-router-dom';

function Gameplay() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      {/* Sub Navigation */}
      <div className="game-subnav">
        <span className="game-subnav__current">Gameplay</span>
        <Link to="/game/characters" className="game-subnav__link">Characters</Link>
        <Link to="/game/download" className="game-subnav__link">Download</Link>
      </div>

      {/* What is Magic Reader? */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '15px' }}>What is Magic Reader?</h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          Magic Reader is an educational game that combines animation, puzzles, and storytelling. In this game, the player will encounter educational challenges as they progress through each stage of the map. The gameplay will consist of three types; Shooting game, Puzzle Game, and a Platformer Game with brainy tasks for learning, where you are on a hunt, a mission to mend "Word Valley" wrecked by this villain named Miss Spell who stirred up total disorder.
        </p>
      </div>

      {/* How to Play */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '30px' }}>How to Play</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="responsive-flex-row" style={{ gap: '20px' }}>
            <img 
              src="/images/gameplay/challenge-a.png" 
              alt="A Challenge Gameplay" 
              className="gameplay-challenge-img" 
            />
            <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
              In the A challenge, players will test their letter recognition and vocabulary skills. Hints will be given during cutscenes through Sheriff Sans' dialogue and with Pip's help.
            </p>
          </div>

          <div className="responsive-flex-row" style={{ gap: '20px' }}>
            <img 
              src="/images/gameplay/challenge-e.png" 
              alt="E Challenge Gameplay" 
              className="gameplay-challenge-img" 
            />
            <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
              In the E challenge, players test their grammar skills. Pip will provide trivia related to verb rules to guide them.
            </p>
          </div>

          <div className="responsive-flex-row" style={{ gap: '20px' }}>
            <img 
              src="/images/gameplay/challenge-i.png" 
              alt="I Challenge Gameplay" 
              className="gameplay-challenge-img" 
            />
            <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
              In the I challenge, players will test their vocabulary and encoding skills. Hints will be given during cutscenes through Penny Clix' dialogue and with Pip's help.
            </p>
          </div>

          <div className="responsive-flex-row" style={{ gap: '20px' }}>
            <img 
              src="/images/gameplay/challenge-o.png" 
              alt="O Challenge Gameplay" 
              className="gameplay-challenge-img" 
            />
            <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
              In the O challenge, players will test their phonetic skills. Hints will be given during cutscenes through Grandma Phonics' dialogue and with Pip's help.
            </p>
          </div>

          <div className="responsive-flex-row" style={{ gap: '20px' }}>
            <img 
              src="/images/gameplay/challenge-u.png" 
              alt="U Challenge Gameplay" 
              className="gameplay-challenge-img" 
            />
            <p style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', textAlign: 'center' }}>
              In the U challenge, players will test their vowel recognition skills. Hints will be given on the book at each section of the challenge and with Pip's help.
            </p>
          </div>

        </div>
      </div>

      {/* Objectives */}
      <div style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.2rem', marginBottom: '30px' }}>Objectives</h2>
        
        <div className="responsive-flex-row" style={{ gap: '30px' }}>
          <img 
            src="/images/gameplay/vowel-stones.png" 
            alt="Vowel Stones" 
            className="gameplay-challenge-img" 
            style={{ width: '220px', height: '220px', objectFit: 'contain' }}
          />
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
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>W</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Move Forward</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>A</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Move Left</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>S</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Move Backward</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>D</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Move Right</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Spacebar</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Jump</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Left Mouse Button</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Interaction (Puzzles)</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Mouse</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Look Around</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>E</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Interact with NPCs</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Esc</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Menu/Pause</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Left Shift</td><td style={{ padding: '10px', border: '1px solid #d1a7d1' }}>Sprint</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Gameplay;
