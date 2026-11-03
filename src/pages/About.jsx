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
    <div className="page-bg page-bg--about">
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '24px 20px 60px', color: '#fff', position: 'relative', zIndex: 2 }}>
        
        {/* Title Card */}
        <div className="gameplay-info-card" style={{ textAlign: 'center', marginBottom: '35px' }}>
          <span className="gameplay-badge" style={{ marginBottom: '10px' }}>
            <span className="gameplay-badge__letter">✦</span>
            <span>Development Team</span>
          </span>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.4rem', marginBottom: '8px', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            About Dream Pixels
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto' }}>
            Meet the creators and developers behind The Sound Keeper, passionate about combining games, storytelling, and phonics education.
          </p>
        </div>
        
        {/* Team List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {teamMembers.map((member, index) => (
            <div key={index} className="gameplay-card responsive-flex-row" style={{ gap: '28px', alignItems: 'center', padding: '22px 26px' }}>
              
              {/* Profile Avatar */}
              <div style={{ 
                width: '110px', 
                height: '110px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 25px rgba(0,0,0,0.4), 0 0 20px rgba(224, 195, 252, 0.25)',
                border: '3px solid rgba(224, 195, 252, 0.4)',
                overflow: 'hidden'
              }}>
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', ...member.photoStyle }}
                  />
                ) : (
                  <i className="fa-solid fa-user" style={{ fontSize: '3.5rem', color: '#e0c3fc' }}></i>
                )}
              </div>

              {/* Member Details */}
              <div style={{ flex: '1', fontFamily: 'Montserrat, sans-serif', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#f4c975', fontWeight: '700', margin: 0, fontFamily: 'Berkshire Swash, cursive' }}>
                    {member.name}
                  </h3>
                  <span style={{ 
                    background: 'rgba(212, 133, 74, 0.18)', 
                    border: '1px solid rgba(212, 133, 74, 0.45)', 
                    color: '#fce8d5', 
                    padding: '3px 12px', 
                    borderRadius: '16px', 
                    fontSize: '0.78rem', 
                    fontWeight: '700',
                    letterSpacing: '0.04em'
                  }}>
                    {member.role}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                  <span style={{ color: '#e0c3fc', fontWeight: '600' }}>Contribution:</span> {member.cont}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Resources & Attribution */}
        <div className="gameplay-info-card" style={{ marginTop: '50px', padding: '36px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2rem', color: '#d4854a', marginBottom: '10px', fontWeight: '400' }}>
              Resources &amp; Attribution
            </h2>
            <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
              The following third-party resources were used in the development of this project. Full credit goes to their respective creators and owners.
            </p>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(224, 195, 252, 0.15)', background: 'rgba(14, 8, 22, 0.5)' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.88rem',
              color: '#ddd'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(224, 195, 252, 0.25)', background: 'rgba(212, 133, 74, 0.15)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#f4c975', fontWeight: '700', whiteSpace: 'nowrap' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#f4c975', fontWeight: '700' }}>Resource / Asset</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#f4c975', fontWeight: '700' }}>Source / Author</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#f4c975', fontWeight: '700', whiteSpace: 'nowrap' }}>License / Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { category: 'Font', asset: 'Berkshire Swash', source: 'Google Fonts', license: 'SIL Open Font License' },
                  { category: 'Font', asset: 'Montserrat', source: 'Google Fonts', license: 'SIL Open Font License' },
                  { category: 'Icons', asset: 'Font Awesome (Free)', source: 'fontawesome.com', license: 'CC BY 4.0 / Free License' },
                  { category: 'Curriculum', asset: 'MATATAG Curriculum Grade 3 English', source: 'Department of Education (DepEd), Philippines', license: 'Public / Government Material' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                    <td style={{ padding: '11px 16px', color: '#e0c3fc', fontWeight: '600', whiteSpace: 'nowrap' }}>{row.category}</td>
                    <td style={{ padding: '11px 16px', color: '#ffffff' }}>{row.asset}</td>
                    <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.85)' }}>{row.source}</td>
                    <td style={{ padding: '11px 16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{row.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', marginTop: '18px', textAlign: 'center' }}>
            * This project is made for educational purposes only. No commercial gain is intended.
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;
