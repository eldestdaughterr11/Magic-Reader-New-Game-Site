import { Link } from 'react-router-dom';

function Download() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', color: '#fff', textAlign: 'center' }}>
      
      {/* Sub Navigation */}
      <div className="game-subnav">
        <Link to="/game/gameplay" className="game-subnav__link">Gameplay</Link>
        <Link to="/game/characters" className="game-subnav__link">Characters</Link>
        <span className="game-subnav__current">Download</span>
      </div>

      <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Poster Image */}
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '30px', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <img 
            src="/images/poster.png" 
            alt="The Sound Keeper Game Poster" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/400x600/2a1a3d/ffffff?text=Save+your+image+as+poster.png+in+public/images"
            }}
          />
        </div>

        {/* Text */}
        <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.4rem', color: '#e8c97c', marginBottom: '20px', fontWeight: '600' }}>
          Download The Sound Keeper
        </h3>

        {/* Download Button */}
        <a 
          href="https://drive.google.com/drive/folders/1TVxBa-lYOGH7Hs8zswWkypXnR8f9avxn?usp=drive_link" 
          target="_blank"
          rel="noopener noreferrer"
          className="btn" 
          style={{ 
            backgroundColor: '#2a1a3d', 
            color: '#fff', 
            fontFamily: 'Montserrat, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '1.2rem', 
            padding: '15px clamp(20px, 8vw, 80px)',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          DOWNLOAD
        </a>
        
      </div>
    </div>
  );
}

export default Download;
