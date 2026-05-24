import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, activeLessons: 0, recentLogins: 89 });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Listen to Users Collection (Filter out admins)
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      let studentCount = 0;
      snapshot.forEach(doc => {
        if (doc.data().role !== 'admin') {
          studentCount++;
        }
      });
      setStats(prev => ({ ...prev, totalUsers: studentCount }));
    });

    // Listen to Active Lessons (Published)
    const qLessons = query(collection(db, 'lessons'), where("status", "==", "Published"));
    const unsubscribeLessons = onSnapshot(qLessons, (snapshot) => {
      setStats(prev => ({ ...prev, activeLessons: snapshot.size }));
    });

    // Listen to Recent Activities
    const qActivities = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribeActivities = onSnapshot(qActivities, (snapshot) => {
      const acts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(acts);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeLessons();
      unsubscribeActivities();
    };
  }, []);

  return (
    <div>
      <h2 className="admin-page-title">Dashboard Overview</h2>
      
      <div className="admin-stats-grid">
        <div className="cms-card cms-card-stat" style={{ flex: 1, borderLeft: '5px solid #d1a7d1' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{stats.totalUsers}</p>
        </div>
        <div className="cms-card cms-card-stat" style={{ flex: 1, borderLeft: '5px solid #e0c3fc' }}>
          <h3>Active Lessons</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{stats.activeLessons}</p>
        </div>
        <div className="cms-card cms-card-stat" style={{ flex: 1, borderLeft: '5px solid #f5e6d3' }}>
          <h3>Recent Logins</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{stats.recentLogins}</p>
        </div>
      </div>

      <div className="cms-card">
        <h3>Recent Activity</h3>
        <div className="admin-table-wrapper">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? activities.map(act => (
                <tr key={act.id}>
                  <td>{act.action}</td>
                  <td>{act.user}</td>
                  <td>{new Date(act.timestamp).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>No recent activity yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
