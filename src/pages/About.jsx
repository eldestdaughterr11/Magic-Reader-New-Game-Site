function About() {
  const teamMembers = [
    { 
      name: "Ashley Margaux A. Solis", 
      role: "Project Manager", 
      cont: "Managing the team" 
    },
    { 
      name: "Danica Joie R. Allauigan", 
      role: "Data Analyst", 
      cont: "Budgeting for the costs of making the game and other expenses" 
    },
    { 
      name: "Christian Joseph G. Doronio", 
      role: "Document Specialist", 
      cont: "Formatting of the manuscript and other documents" 
    },
    { 
      name: "Van Ryan M. Navarez", 
      role: "Programmer (Website)", 
      cont: "Developing the whole website" 
    },
    { 
      name: "Carlos Miguel A. Agila", 
      role: "Programmer (Game)", 
      cont: "Developing the whole game" 
    },
    { 
      name: "Derille P. Pagayon", 
      role: "3D Artist", 
      cont: "Modeling of the characters and environment" 
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.5rem', color: '#e0c3fc', marginBottom: '10px', fontWeight: '400' }}>
          About Dream Pixels
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8c97c', fontSize: '1.1rem' }}>
          Team Description
        </p>
      </div>
      
      {/* Team List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {teamMembers.map((member, index) => (
          <div key={index} className="responsive-flex-row" style={{ gap: '30px' }}>
            
            {/* Profile Avatar Placeholder */}
            <div style={{ 
              width: '120px', 
              height: '120px', 
              backgroundColor: '#e6e6e6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              {/* Default icon using FontAwesome */}
              <i className="fa-solid fa-user" style={{ fontSize: '4rem', color: '#a0a0a0', marginTop: '20px' }}></i>
            </div>

            {/* Member Details */}
            <div style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#e0c3fc', marginBottom: '5px', fontWeight: '700' }}>
                {member.name}
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#e8c97c', fontWeight: '600' }}>Role:</span> {member.role}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                <span style={{ color: '#e8c97c', fontWeight: '600' }}>Contribution:</span> {member.cont}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default About;
