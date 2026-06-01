import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, query, orderBy, updateDoc, where, getDocs } from 'firebase/firestore';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleViewLogs = async (user) => {
    setLoggedUser(user);
    setLoadingLogs(true);
    setUserLogs([]);
    try {
      const q = query(collection(db, 'user_logs'), where('userId', '==', user.id));
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort on client side to avoid needing composite index in Firestore
      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setUserLogs(logs);
    } catch (err) {
      console.error("Error fetching user logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    // Real-time listener
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role !== 'admin'); // Do not show admins
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleBan = async (id, name, currentStatus) => {
    const action = currentStatus ? 'unban' : 'ban';
    if (window.confirm(`Are you sure you want to ${action} ${name}?`)) {
      try {
        await updateDoc(doc(db, 'users', id), {
          isBanned: !currentStatus
        });
        alert(`${name} has been ${action}ned.`);
      } catch (err) {
        console.error(`Error ${action}ning user: `, err);
      }
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">Manage Users</h2>

      <div className="cms-card">
        <div className="admin-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Total Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontSize: '0.8em', color: '#ccc' }}>{user.id.substring(0, 5)}...</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.score || 0}</td>
                  <td style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="cms-btn cms-btn-warning" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      onClick={() => setSelectedUser(user)}
                    >
                      View Profile
                    </button>
                    <button 
                      className="cms-btn" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#9c27b0', color: '#fff' }}
                      onClick={() => handleViewLogs(user)}
                    >
                      View Logs
                    </button>
                    <button 
                      className={`cms-btn ${user.isBanned ? 'cms-btn-primary' : 'cms-btn-danger'}`}
                      style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: user.isBanned ? '#4caf50' : '#d4854a' }}
                      onClick={() => handleToggleBan(user.id, user.name, user.isBanned)}
                    >
                      {user.isBanned ? 'Unban User' : 'Ban User'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found in Firebase.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modal for View Profile */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '15px'
        }}>
          <div className="cms-card" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', position: 'relative' }}>
            <h3 style={{ marginTop: 0 }}>User Profile</h3>
            <div style={{ padding: '20px 0', color: '#fff' }}>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Total Score:</strong> {selectedUser.score || 0}</p>
              <p><strong>Status:</strong> {selectedUser.isBanned ? 'Banned' : 'Active'}</p>
            </div>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button 
                className="cms-btn cms-btn-primary" 
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for User Logs */}
      {loggedUser && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '15px'
        }}>
          <div className="cms-card" style={{ width: '100%', maxWidth: '550px', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <h3 style={{ marginTop: 0, color: '#e0c3fc' }}>User Logs: {loggedUser.name}</h3>
            
            <div style={{ overflowY: 'auto', flex: 1, padding: '10px 0', margin: '15px 0', minHeight: '150px' }}>
              {loadingLogs ? (
                <p style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>Loading activity logs...</p>
              ) : userLogs.length > 0 ? (
                <table className="cms-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px' }}>Action</th>
                      <th style={{ padding: '8px' }}>Email</th>
                      <th style={{ padding: '8px' }}>Date / Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLogs.map(log => (
                      <tr key={log.id}>
                        <td style={{ padding: '8px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85em',
                            fontWeight: '600',
                            backgroundColor: log.action === 'Login' ? '#4caf50' : log.action === 'Logout' ? '#d4854a' : '#9c27b0',
                            color: '#fff'
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '8px' }}>{log.email}</td>
                        <td style={{ padding: '8px', fontSize: '0.9em' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#ccc', padding: '20px' }}>No logs recorded for this user yet.</p>
              )}
            </div>
            
            <div style={{ textAlign: 'right', marginTop: '15px' }}>
              <button 
                className="cms-btn cms-btn-primary" 
                onClick={() => setLoggedUser(null)}
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
