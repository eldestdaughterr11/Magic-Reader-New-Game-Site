import { Link } from 'react-router-dom';

function Resources() {
  const resourceLinks = [
    "Vocabulary Guide",
    "Grammar Tips",
    "Practice Exercises",
    "Reading Nook"
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', textAlign: 'center' }}>
      
      {/* Title */}
      <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.8rem', color: '#e0c3fc', marginBottom: '40px', fontWeight: '400' }}>
        Grade 3 English Resources
      </h2>
      
      {/* Resource Links List */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: '#f5e6d3',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
      }}>
        {resourceLinks.map((link, index) => (
          <a 
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert(`${link} content will be available soon!`);
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '25px 20px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '700',
              fontSize: '1.2rem',
              color: '#3d2b4f',
              textDecoration: 'none',
              borderBottom: index !== resourceLinks.length - 1 ? '1px solid #d1a7d1' : 'none',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e8d4bd'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {link}
          </a>
        ))}
      </div>

    </div>
  );
}

export default Resources;
