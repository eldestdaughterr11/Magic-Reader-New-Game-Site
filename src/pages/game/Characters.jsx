import { useState } from 'react';
import { Link } from 'react-router-dom';

function Characters() {
  const [failedImages, setFailedImages] = useState({});

  const charData = [
    {
      name: "Penn",
      desc: "The male lead student who is jolly and enjoys playing with his classmates, but is silent because he struggles with reading words and sentences.",
      sprites: [
        "/images/characters/penn-1.png",
        "/images/characters/penn-2.png"
      ]
    },
    {
      name: "Paige",
      desc: "The female lead student who loves hanging with her friends, but hates attending English class because she struggles with reading words and sentences.",
      sprites: [
        "/images/characters/paige-1.png",
        "/images/characters/paige-2.png"
      ]
    },

    {
      name: "The Archmage (NPC)",
      desc: "The powerful mage who serves as Word Valley's protector and guardian. She was cursed and transformed into an owl by Miss Spell. The housepeople admire her for her greatness and remarkable magical skills. She is revealed at the game's conclusion when the curse is finally broken.",
      sprites: [
        "/images/characters/archmage-1.png",
        "/images/characters/archmage-2.png",
        "/images/characters/archmage-3.png",
        "/images/characters/archmage-4.png"
      ]
    },
    {
      name: "The Antagonist (Miss Spell) NPC",
      desc: "Miss Spell is the cursed form of the Word Valley. Her motivation stems from frustration rather than evil. Her letters and words appear in disarray just like the protagonist. Driven by envy, she casts the curse to scramble the languages of the realm and breaks the physical letters of the world into fragmented pieces.",
      sprites: [
        "/images/characters/antagonist-1.png",
        "/images/characters/antagonist-2.png",
        "/images/characters/antagonist-3.png"
      ]
    },
    {
      name: "Sylla Bella",
      desc: "Sylla Bella is a non-interactable NPC, who appears at the end of the game, reuniting the Vowel Book from Penn or Paige, and has a striking resemblance to Miss Spell.",
      sprites: [
        "/images/characters/syllabella-1.png"
      ]
    },
    {
      name: "Town Governor: Sherriff Sans (House A)",
      desc: "House 'A' Governed by Sherriff Sans. The player uses the vowel to pick up fragmented parts of objects and place them into the correct spots. This visual puzzle tests letter recognition and formation.",
      sprites: [
        "/images/characters/sherriff-1.png"
      ]
    },
    {
      name: "Town Governor: Judge Mental (House E)",
      desc: "House 'E' Governed by Judge Mental. The player reads an incomplete sentence on a scroll. They must use the magic wand to select the correct linking verb such as is or are to complete the sentence grammar.",
      sprites: [
        "/images/characters/judge-1.png"
      ]
    },
    {
      name: "Town Governor: Penny Cil (House I)",
      desc: "House 'I' Managed by Penny Cil. This area focuses on spelling and word arrangement. The player must retrieve scattered letters from the level and arrange them in the correct sequence to form a valid word.",
      sprites: [
        "/images/characters/penny-1.png"
      ]
    },
    {
      name: "Town Governor: Grandma Phonic (House O)",
      desc: "House 'O' Governed by Grandma Phonics. This is an auditory challenge where the player listens to scrambled music beats. They must choose the correct rhyming words to complete the lyrics of a song.",
      sprites: [
        "/images/characters/grandma-1.png"
      ]
    },
    {
      name: "Town Governor: Connie Sonant (House U)",
      desc: "House 'U' Directed by Connie Sonant. Set in a chaotic library, this puzzle tests auditory sound recognition. The player listens to a scrambled word and must identify the specific vowel sound used in the audio clip.",
      sprites: [
        "/images/characters/connie-1.png"
      ]
    },
    {
      name: "Teacher and Students (Non-interactable NPCs)",
      desc: "Teachers and students are non-interactable NPCs who appear in the cutscenes (Intro and Outro) to portray a classroom environment.",
      sprites: [
        "/images/characters/teacher-1.png"
      ]
    }
  ];

  const handleImageError = (charIndex, spriteIndex) => {
    setFailedImages(prev => ({
      ...prev,
      [`${charIndex}-${spriteIndex}`]: true
    }));
  };

  return (
    <div className="characters-page">
      {/* Sub Navigation */}
      <div className="game-subnav">
        <Link to="/game/gameplay" className="game-subnav__link">Gameplay</Link>
        <span className="game-subnav__current">Characters</span>
        <Link to="/game/download" className="game-subnav__link">Download</Link>
      </div>

      <div style={{ marginTop: '60px' }}>
        {charData.map((char, charIndex) => (
          <div key={charIndex} className="character-row">
            
            {/* Sprites Area */}
            <div className="character-sprites">
              {char.sprites.map((spritePath, spriteIndex) => {
                const imgKey = `${charIndex}-${spriteIndex}`;
                const isMissing = failedImages[imgKey];
                return (
                  <div key={spriteIndex} className={`sprite-cell ${isMissing ? 'sprite-cell--missing' : ''}`}>
                    <img 
                      src={spritePath} 
                      alt={`${char.name} Sprite ${spriteIndex + 1}`} 
                      onError={() => handleImageError(charIndex, spriteIndex)}
                    />
                    <div className="sprite-cell__fallback" />
                  </div>
                );
              })}
            </div>

            {/* Description Area */}
            <div className="character-copy">
              <h3 className="character-name">
                {char.name}
              </h3>
              <p className="character-desc">
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
