import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Resources() {
  const [cmsLessons, setCmsLessons] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    // Fetch only Published lessons from CMS
    const q = query(collection(db, 'lessons'), where('status', '==', 'Published'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCmsLessons(lessonsData);
    });

    return () => unsubscribe();
  }, []);

  const resourceCategories = [
    "Vocabulary Guide",
    "Grammar Tips",
    "Practice Exercises",
    "Reading Nook"
  ];

  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff', textAlign: 'center' }}>
      
      {/* Title */}
      <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.8rem', color: '#e0c3fc', marginBottom: '40px', fontWeight: '400' }}>
        Grade 3 English Resources
      </h2>
      
      {/* Categories Accordion */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: '#f5e6d3',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {resourceCategories.map((category, index) => {
          const categoryLessons = cmsLessons.filter(l => (l.category || 'Vocabulary Guide') === category);
          
          return (
            <div key={category} style={{ width: '100%' }}>
              <div 
                onClick={() => toggleCategory(category)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '25px 20px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  color: '#3d2b4f',
                  cursor: 'pointer',
                  borderBottom: index !== resourceCategories.length - 1 || expandedCategory === category ? '1px solid #d1a7d1' : 'none',
                  backgroundColor: expandedCategory === category ? '#e8d4bd' : 'transparent',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => { if(expandedCategory !== category) e.currentTarget.style.backgroundColor = '#f0e1cf' }}
                onMouseOut={(e) => { if(expandedCategory !== category) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span>{category}</span>
                <i className={`fa-solid ${expandedCategory === category ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
              </div>
              
              {/* Lessons List for this Category */}
              {expandedCategory === category && (
                <div style={{ 
                  backgroundColor: '#fff', 
                  borderBottom: index !== resourceCategories.length - 1 ? '1px solid #d1a7d1' : 'none',
                  textAlign: 'left'
                }}>
                  {categoryLessons.length > 0 ? (
                    categoryLessons.map(lesson => (
                      <div 
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        style={{
                          padding: '15px 30px',
                          borderBottom: '1px solid #eee',
                          color: '#555',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontFamily: 'Montserrat, sans-serif'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                      >
                        <i className="fa-solid fa-book" style={{ color: '#d4854a' }}></i>
                        {lesson.title}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: '#999', fontStyle: 'italic', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
                      No lessons available yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson Content Modal */}
      {selectedLesson && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px',
              backgroundColor: '#3d2b4f',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontFamily: 'Berkshire Swash, cursive', fontSize: '1.5rem', color: '#e0c3fc' }}>
                {selectedLesson.title}
              </h3>
              <button 
                onClick={() => setSelectedLesson(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body */}
            <div style={{
              padding: '30px',
              overflowY: 'auto',
              color: '#333',
              textAlign: 'left',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {selectedLesson.contentText ? (
                selectedLesson.contentText.startsWith('http') ? (
                  <a href={selectedLesson.contentText} target="_blank" rel="noopener noreferrer" style={{ color: '#d4854a', fontWeight: 'bold' }}>
                    Click here to open the link
                  </a>
                ) : (
                  <div>{selectedLesson.contentText}</div>
                )
              ) : (
                <div style={{ color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                  No content provided for this lesson.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Resources;
