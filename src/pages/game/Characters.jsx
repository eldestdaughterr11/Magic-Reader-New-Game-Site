import { Link } from 'react-router-dom';

function Characters() {
  const charData = [
    { name: "Penn", desc: "The male lead student who is jolly and enjoys playing with his classmates, but is silent because he struggles with reading words and sentences.", slots: 2 },
    { name: "Paige", desc: "The female lead student who loves hanging with her friends, but hates attending English class because she struggles with reading words and sentences.", slots: 2 },
    { name: "The Guide (Pip the Owl) NPC", desc: "Pip is the Mayor of Word Valley and appears as a magical owl. He acts as a guide and tutorial system. He provides good guidance and clues to help the player navigate the challenges without revealing the direct answers.", slots: 3 },
    { name: "The Archmage (NPC)", desc: "The powerful mage who serves as Word Valley's protector and guardian. She was cursed and transformed into an owl by Miss Spell. The housepeople admire her for her greatness and remarkable magical skills. She is revealed at the game's conclusion when the curse is finally broken.", slots: 3 },
    { name: "The Antagonist (Miss Spell) NPC", desc: "Miss Spell is the cursed form of the Word Valley. Her motivation stems from frustration rather than evil. Her letters and words appear in disarray just like the protagonist. Driven by envy, she casts the curse to scramble the languages of the realm and breaks the physical letters of the world into fragmented pieces.", slots: 3 },
    { name: "Sylla Bella", desc: "Sylla Bella is a non-interactable NPC, who appears at the end of the game, reuniting the Vowel Book from Penn or Paige, and has a striking resemblance to Miss Spell.", slots: 1 },
    { name: "Town Governor: Sherriff Sans (House A)", desc: "House 'A' Governed by Sherriff Sans. The player uses the vowel to pick up fragmented parts of objects and place them into the correct spots. This visual puzzle tests letter recognition and formation.", slots: 1 },
    { name: "Town Governor: Judge Mental (House E)", desc: "House 'E' Governed by Judge Mental. The player reads an incomplete sentence on a scroll. They must use the magic wand to select the correct linking verb such as is or are to complete the sentence grammar.", slots: 1 },
    { name: "Town Governor: Penny Cil (House I)", desc: "House 'I' Managed by Penny Cil. This area focuses on spelling and word arrangement. The player must retrieve scattered letters from the level and arrange them in the correct sequence to form a valid word.", slots: 1 },
    { name: "Town Governor: Grandma Phonic (House O)", desc: "House 'O' Governed by Grandma Phonics. This is an auditory challenge where the player listens to scrambled music beats. They must choose the correct rhyming words to complete the lyrics of a song.", slots: 1 },
    { name: "Town Governor: Connie Sonant (House U)", desc: "House 'U' Directed by Connie Sonant. Set in a chaotic library, this puzzle tests auditory sound recognition. The player listens to a scrambled word and must identify the specific vowel sound used in the audio clip.", slots: 1 },
    { name: "Teacher and Students (Non-interactable NPCs)", desc: "Teachers and students are non-interactable NPCs who appear in the cutscenes (Intro and Outro) to portray a classroom environment.", slots: 1 }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      {/* Sub Navigation */}
      <div className="game-subnav">
        <Link to="/game/gameplay" className="game-subnav__link">Gameplay</Link>
        <span className="game-subnav__current">Characters</span>
        <Link to="/game/download" className="game-subnav__link">Download</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', marginTop: '60px' }}>
        {charData.map((char, index) => (
          <div key={index} className="responsive-flex-row" style={{ gap: '30px' }}>
            
            {/* Sprites Area */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '300px', flexShrink: 0 }}>
              {Array.from({ length: char.slots }).map((_, i) => (
                <div key={i} style={{ 
                  width: char.slots === 1 ? '160px' : '90px', 
                  height: char.slots === 1 ? '220px' : '150px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  border: '1px dashed rgba(255,255,255,0.2)', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#aaa', 
                  fontStyle: 'italic', 
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  padding: '10px'
                }}>
                  Sprite {i + 1}
                </div>
              ))}
            </div>

            {/* Description Area */}
            <div style={{ flex: '1', maxWidth: '450px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '1.6rem', color: '#e8c97c', marginBottom: '10px', fontWeight: '400' }}>
                {char.name}
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', lineHeight: '1.6' }}>
                {char.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Characters;
