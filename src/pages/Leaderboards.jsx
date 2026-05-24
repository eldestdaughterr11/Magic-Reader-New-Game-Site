import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch users in real-time
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role !== 'admin') // Exclude admins
        .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending
      
      setLeaderboard(usersData);
    });

    return () => unsubscribe();
  }, []);

  // Determine achievement title based on score
  const getAchievement = (score) => {
    const s = score || 0;
    if (s >= 5000) return "Word Master";
    if (s >= 4000) return "Fast Solver";
    if (s >= 3000) return "Minigames fanatic";
    if (s >= 2000) return "Grammar Wizard";
    if (s >= 1000) return "Spelling Bee";
    return "Beginner Reader";
  };

  const tableHeaderStyle = {
    padding: '15px', 
    border: '1px solid #d1a7d1', 
    borderBottom: '2px solid #3d2b4f',
    fontWeight: 'bold'
  };

  const tableCellStyle = {
    padding: '12px', 
    border: '1px solid #d1a7d1'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', color: '#fff', textAlign: 'center' }}>
      
      {/* Leaderboard Table Section */}
      <h2 className="section-title" style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.5rem', color: '#e0c3fc', marginBottom: '30px' }}>
        Leaderboard Table
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px', width: '100%' }}>
        <div className="scrollable-wrapper" style={{ margin: 0, maxWidth: '700px', width: '100%' }}>
          <table style={{ 
            width: '100%', 
            minWidth: '450px',
            borderCollapse: 'collapse', 
            backgroundColor: '#f5e6d3', 
            color: '#3d2b4f',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Rank</th>
                <th style={tableHeaderStyle}>Player</th>
                <th style={tableHeaderStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{user.score || 0}</td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="3" style={tableCellStyle}>No players found. Play the game to get ranked!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements Table Section */}
      <h2 className="section-title" style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.5rem', color: '#e0c3fc', marginBottom: '30px' }}>
        Achievements
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', width: '100%' }}>
        <div className="scrollable-wrapper" style={{ margin: 0, maxWidth: '700px', width: '100%' }}>
          <table style={{ 
            width: '100%', 
            minWidth: '450px',
            borderCollapse: 'collapse', 
            backgroundColor: '#f5e6d3', 
            color: '#3d2b4f',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Rank</th>
                <th style={tableHeaderStyle}>Player</th>
                <th style={tableHeaderStyle}>Achievements</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.id + "_ach"}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{getAchievement(user.score)}</td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan="3" style={tableCellStyle}>No players found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Leaderboards;
