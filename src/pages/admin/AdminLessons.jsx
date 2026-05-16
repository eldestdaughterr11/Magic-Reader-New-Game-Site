import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', status: 'Draft' });

  useEffect(() => {
    // Real-time listener using Firebase onSnapshot
    const q = query(collection(db, 'lessons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, 'lessons', id));
        alert(`Lesson "${title}" has been deleted.`);
      } catch (err) {
        console.error('Error deleting document: ', err);
      }
    }
  };

  const handleOpenModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({ title: lesson.title, status: lesson.status });
    } else {
      setEditingLesson(null);
      setFormData({ title: '', status: 'Draft' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setFormData({ title: '', status: 'Draft' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }

    try {
      if (editingLesson) {
        // Update Firebase
        const lessonRef = doc(db, 'lessons', editingLesson.id);
        await updateDoc(lessonRef, {
          title: formData.title,
          status: formData.status
        });
        alert('Lesson updated successfully.');
      } else {
        // Add new to Firebase
        await addDoc(collection(db, 'lessons'), {
          title: formData.title,
          status: formData.status,
          createdAt: new Date().toISOString()
        });
        alert('New lesson added successfully.');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving document: ', err);
      alert('Failed to save lesson.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="admin-page-title" style={{ margin: 0 }}>Manage Lessons</h2>
        <button className="cms-btn cms-btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus"></i> Add New Lesson
        </button>
      </div>

      <div className="cms-card">
        <table className="cms-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Lesson Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td style={{ fontSize: '0.8em', color: '#ccc' }}>{lesson.id.substring(0, 5)}...</td>
                <td><strong>{lesson.title}</strong></td>
                <td>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: lesson.status === 'Published' ? 'rgba(72, 187, 120, 0.2)' : 'rgba(243, 156, 18, 0.2)',
                    color: lesson.status === 'Published' ? '#a8e6cf' : '#f39c12'
                  }}>
                    {lesson.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="cms-btn cms-btn-warning" 
                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleOpenModal(lesson)}
                  >
                    Edit
                  </button>
                  <button 
                    className="cms-btn cms-btn-danger" 
                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    onClick={() => handleDelete(lesson.id, lesson.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No lessons found. Create one now!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="cms-card" style={{ width: '400px', position: 'relative' }}>
            <h3 style={{ marginTop: 0 }}>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h3>
            
            <form onSubmit={handleSave} style={{ paddingTop: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0c3fc', fontWeight: 'bold' }}>Lesson Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                  placeholder="Enter lesson title..."
                  required
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0c3fc', fontWeight: 'bold' }}>Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="cms-btn" 
                  style={{ backgroundColor: 'transparent', border: '1px solid #fff', color: '#fff' }}
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="cms-btn cms-btn-primary"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLessons;
