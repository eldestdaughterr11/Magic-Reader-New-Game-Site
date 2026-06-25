import { useState, useEffect } from 'react';
import { db, functions } from '../../firebase';
import { collection, onSnapshot, doc, query, orderBy, updateDoc, where, getDocs, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

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

  const cleanupUserData = async (userId) => {
    try {
      // 1. Delete all forum posts written by this user
      const postsQuery = query(collection(db, 'forums'), where('authorId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      
      for (const postDoc of postsSnapshot.docs) {
        const postId = postDoc.id;
        // Delete all comments/replies on this post
        const commentsQuery = query(collection(db, 'forum_comments'), where('forumId', '==', postId));
        const commentsSnapshot = await getDocs(commentsQuery);
        const deleteCommentsPromises = commentsSnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deleteCommentsPromises);
        
        // Delete the post itself
        await deleteDoc(postDoc.ref);
      }

      // 2. Delete all comments/replies written by this user in other discussions
      const userCommentsQuery = query(collection(db, 'forum_comments'), where('authorId', '==', userId));
      const userCommentsSnapshot = await getDocs(userCommentsQuery);
      
      for (const commentDoc of userCommentsSnapshot.docs) {
        const commentData = commentDoc.data();
        const forumId = commentData.forumId;
        
        // Delete the comment itself
        await deleteDoc(commentDoc.ref);
        
        // Decrement commentsCount of parent post if it still exists
        if (forumId) {
          try {
            const forumDocRef = doc(db, 'forums', forumId);
            const forumDoc = await getDoc(forumDocRef);
            if (forumDoc.exists()) {
              const currentCount = forumDoc.data().commentsCount || 0;
              await updateDoc(forumDocRef, {
                commentsCount: Math.max(0, currentCount - 1)
              });
            }
          } catch (e) {
            console.error("Error updating comment count during user cleanup:", e);
          }
        }
      }
    } catch (err) {
      console.error("Error during user data cleanup:", err);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`⚠️ Permanently delete "${user.name}"?\n\nThis will remove them from the database AND revoke their login access forever. This cannot be undone.`)) return;

    try {
      const deleteUser = httpsCallable(functions, 'deleteUser');
      await deleteUser({ uid: user.id, email: user.email });
      
      // Cascade delete posts and comments
      await cleanupUserData(user.id);
      
      alert(`✅ ${user.name}'s account and their discussions/replies have been permanently deleted.`);
    } catch (err) {
      console.error('Error deleting user:', err);
      
      const errorMessage = err.message || '';
      const fallbackPrompt = `❌ Failed to delete account via Cloud Function: ${errorMessage}\n\nWould you like to delete this user directly from the Firestore database instead?\n\n(Note: This removes their profile from the CMS, but their login credentials will remain active until Cloud Functions are deployed/updated).`;
      
      if (window.confirm(fallbackPrompt)) {
        try {
          // Delete from users collection
          await deleteDoc(doc(db, 'users', user.id));
          
          // Cascade delete posts and comments
          await cleanupUserData(user.id);
          
          // Log to activities
          await addDoc(collection(db, 'activities'), {
            action: `Admin Deleted User Profile directly: ${user.email || user.id}`,
            user: 'Admin Moderator',
            timestamp: new Date().toISOString()
          });

          alert(`✅ ${user.name}'s profile and their discussions/replies have been deleted from Firestore database.`);
        } catch (dbErr) {
          console.error('Error deleting user doc directly:', dbErr);
          alert(`❌ Failed to delete Firestore document: ${dbErr.message}`);
        }
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
                <th>Status</th>
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
                  <td>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8em',
                      fontWeight: '600',
                      backgroundColor: user.isBanned ? '#b71c1c' : '#1b5e20',
                      color: '#fff'
                    }}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    <button 
                      className="cms-btn cms-btn-danger"
                      style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#c62828', color: '#fff' }}
                      onClick={() => handleDeleteUser(user)}
                    >
                      🗑 Delete
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
