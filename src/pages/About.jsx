function About() {
  const teamMembers = [
    { 
      name: "Ashley Margaux A. Solis", 
      role: "Project Manager", 
      cont: "Managing the team",
      photo: "/images/team/solis.jpg"
    },
    { 
      name: "Danica Joie R. Allauigan", 
      role: "Data Analyst", 
      cont: "Budgeting for the costs of making the game and other expenses",
      photo: "/images/team/allauigan.jpg",
      photoStyle: { objectPosition: "center 15%" }
    },
    { 
      name: "Christian Joseph G. Doronio", 
      role: "Document Specialist", 
      cont: "Formatting of the manuscript and other documents",
      photo: "/images/team/doronio.jpg"
    },
    { 
      name: "Van Ryan M. Navarez", 
      role: "Programmer (Website)", 
      cont: "Developing the whole website",
      photo: "/images/team/navarez.jpg"
    },
    { 
      name: "Carlos Miguel A. Agila", 
      role: "Programmer (Game)", 
      cont: "Developing the whole game",
      photo: "/images/team/agila.jpg"
    },
    { 
      name: "Derille P. Pagayon", 
      role: "3D Artist", 
      cont: "Modeling of the characters and environment",
      photo: "/images/team/pagayon.jpg",
      photoStyle: { objectPosition: "center 20%" }
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
            
            {/* Profile Avatar */}
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
              {member.photo ? (
                <img 
                  src={member.photo} 
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', ...member.photoStyle }}
                />
              ) : (
                <i className="fa-solid fa-user" style={{ fontSize: '4rem', color: '#a0a0a0', marginTop: '20px' }}></i>
              )}
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

      {/* Resources & Attribution */}
      <div style={{ marginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2rem', color: '#e0c3fc', marginBottom: '10px', fontWeight: '400' }}>
            Resources &amp; Attribution
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#ccc', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            The following third-party resources were used in the development of this project. Full credit goes to their respective creators and owners.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.88rem',
            color: '#ddd'
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0c3fc' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e8c97c', fontWeight: '700', whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e8c97c', fontWeight: '700' }}>Resource / Asset</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e8c97c', fontWeight: '700' }}>Source / Author</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#e8c97c', fontWeight: '700', whiteSpace: 'nowrap' }}>License / Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { category: 'Font', asset: 'Berkshire Swash', source: 'Google Fonts', license: 'SIL Open Font License' },
                { category: 'Font', asset: 'Montserrat', source: 'Google Fonts', license: 'SIL Open Font License' },
                { category: 'Icons', asset: 'Font Awesome (Free)', source: 'fontawesome.com', license: 'CC BY 4.0 / Free License' },
                { category: 'Curriculum', asset: 'MATATAG Curriculum Grade 3 English', source: 'Department of Education (DepEd), Philippines', license: 'Public / Government Material' },
                // Add more rows below as needed
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                  <td style={{ padding: '11px 16px', color: '#e0c3fc', fontWeight: '600', whiteSpace: 'nowrap' }}>{row.category}</td>
                  <td style={{ padding: '11px 16px' }}>{row.asset}</td>
                  <td style={{ padding: '11px 16px', color: '#ccc' }}>{row.source}</td>
                  <td style={{ padding: '11px 16px', color: '#aaa', fontSize: '0.82rem' }}>{row.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#888', fontSize: '0.8rem', marginTop: '20px', textAlign: 'center' }}>
          * This project is made for educational purposes only. No commercial gain is intended.
        </p>
      </div>

    </div>
  );
}

export default About;
