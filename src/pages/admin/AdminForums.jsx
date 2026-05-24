import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  where, 
  updateDoc, 
  addDoc 
} from 'firebase/firestore';

function AdminForums() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['General', 'Game Help', 'Feedback', 'Study Group'];

  // Fetch admin user profile info
  useEffect(() => {
    const fetchAdminProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUserProfile(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching admin profile: ", err);
        }
      }
    };
    fetchAdminProfile();
  }, []);

  // Fetch all forum discussions in real-time
  useEffect(() => {
    const q = query(collection(db, 'forums'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch comments in real-time for selected post
  useEffect(() => {
    if (!selectedPost) return;

    const q = query(
      collection(db, 'forum_comments'),
      where('forumId', '==', selectedPost.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [selectedPost]);

  // Cascade Deletion of Forum Thread
  const handleDeletePost = async (postId, postTitle) => {
    if (window.confirm(`WARNING: Are you sure you want to permanently delete the discussion "${postTitle}"?\nThis will also delete all of its comments and replies!`)) {
      try {
        // 1. Fetch and delete comments associated with the post
        const commentsQuery = query(collection(db, 'forum_comments'), where('forumId', '==', postId));
        const commentsSnapshot = await getDocs(commentsQuery);
        const deletePromises = commentsSnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);

        // 2. Delete the post itself
        await deleteDoc(doc(db, 'forums', postId));

        // 3. Log the moderation action in activities
        const adminName = currentUserProfile?.name || auth.currentUser?.email || 'Admin Moderator';
        await addDoc(collection(db, 'activities'), {
          action: `Moderator Deleted Thread: "${postTitle}"`,
          user: adminName,
          timestamp: new Date().toISOString()
        });

        setSelectedPost(null);
        alert(`Discussion "${postTitle}" and all associated replies have been successfully deleted.`);
      } catch (err) {
        console.error("Error deleting post: ", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  // Delete Individual Inappropriate Comment
  const handleDeleteComment = async (commentId, commentAuthor, commentSnippet) => {
    if (window.confirm(`Are you sure you want to delete the reply by "${commentAuthor}"?`)) {
      try {
        // 1. Delete comment
        await deleteDoc(doc(db, 'forum_comments', commentId));

        // 2. Decrement comments count on the forums post
        const postRef = doc(db, 'forums', selectedPost.id);
        const newCount = Math.max(0, (selectedPost.commentsCount || 1) - 1);
        await updateDoc(postRef, {
          commentsCount: newCount
        });

        // Update selectedPost local state
        setSelectedPost(prev => ({
          ...prev,
          commentsCount: newCount
        }));

        // 3. Log the moderation action in activities
        const adminName = currentUserProfile?.name || auth.currentUser?.email || 'Admin Moderator';
        await addDoc(collection(db, 'activities'), {
          action: `Moderator Deleted Comment by ${commentAuthor}: "${commentSnippet.substring(0, 30)}..."`,
          user: adminName,
          timestamp: new Date().toISOString()
        });

        alert("Reply has been deleted successfully.");
      } catch (err) {
        console.error("Error deleting comment: ", err);
        alert("Failed to delete reply.");
      }
    }
  };

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h2 className="admin-page-title">Forum Moderation Console</h2>

      {/* Stats Card */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div className="cms-card cms-card-stat" style={{ flex: 1, borderLeft: '5px solid #d1a7d1' }}>
          <h3>Total Discussions</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>{posts.length}</p>
        </div>
        <div className="cms-card cms-card-stat" style={{ flex: 1, borderLeft: '5px solid #e0c3fc' }}>
          <h3>Active Category</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, color: '#e0c3fc' }}>{activeCategory}</p>
        </div>
      </div>

      {/* Filter and Search Card */}
      <div className="cms-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '25px' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
          <input 
            type="text" 
            placeholder="Search threads, content, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px 10px 40px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: '#fff',
              fontSize: '0.95rem',
              fontFamily: 'Montserrat, sans-serif'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveCategory('All')}
            style={{
              padding: '6px 15px',
              borderRadius: '15px',
              border: '1px solid #d1a7d1',
              backgroundColor: activeCategory === 'All' ? '#e0c3fc' : 'transparent',
              color: activeCategory === 'All' ? '#3d2b4f' : '#fff',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 15px',
                borderRadius: '15px',
                border: '1px solid #d1a7d1',
                backgroundColor: activeCategory === cat ? '#e0c3fc' : 'transparent',
                color: activeCategory === cat ? '#3d2b4f' : '#fff',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Forums Thread List Table */}
      <div className="cms-card">
        <table className="cms-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Replies</th>
              <th>Date Created</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{post.title}</strong>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#ccc', 
                      marginTop: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '400px'
                    }}>
                      {post.content}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: '5px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold', 
                      backgroundColor: '#e0c3fc', 
                      color: '#3d2b4f',
                      textTransform: 'uppercase'
                    }}>
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-regular fa-circle-user" style={{ color: '#e0c3fc', fontSize: '0.95rem' }}></i>
                      <span>{post.authorName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                      <i className="fa-regular fa-comment-dots"></i>
                      <span>{post.commentsCount || 0}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#f5e6d3' }}>
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        className="cms-btn cms-btn-warning"
                        style={{ padding: '5px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        onClick={() => setSelectedPost(post)}
                      >
                        <i className="fa-regular fa-eye"></i> View
                      </button>
                      <button 
                        className="cms-btn cms-btn-danger"
                        style={{ padding: '5px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        onClick={() => handleDeletePost(post.id, post.title)}
                      >
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#ccc' }}>
                  <i className="fa-solid fa-comments" style={{ fontSize: '2rem', color: '#e0c3fc', marginBottom: '10px', display: 'block' }}></i>
                  No discussions found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Moderation & Detail Modal */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            color: '#333'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '18px 25px',
              backgroundColor: '#3d2b4f',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #d1a7d1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  backgroundColor: '#e0c3fc',
                  color: '#3d2b4f',
                  textTransform: 'uppercase'
                }}>
                  {selectedPost.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#f5e6d3', fontFamily: 'Montserrat, sans-serif' }}>Thread Moderation</span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  lineHeight: '1'
                }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '25px', overflowY: 'auto', flex: '1', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Original Post */}
              <div style={{ backgroundColor: '#fcf8ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3d2b4f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', fontWeight: '700', color: '#3d2b4f', lineHeight: '1.3' }}>
                    {selectedPost.title}
                  </h3>
                  <button
                    onClick={() => handleDeletePost(selectedPost.id, selectedPost.title)}
                    style={{
                      backgroundColor: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat, sans-serif',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i> Delete Post
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '0.85rem', color: '#718096' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3d2b4f', fontWeight: 'bold' }}>
                    <i className="fa-regular fa-circle-user"></i> {selectedPost.authorName}
                  </span>
                  <span>•</span>
                  <span>{new Date(selectedPost.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#2d3748',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedPost.content}
                </p>
              </div>

              <hr style={{ border: 0, height: '1px', backgroundColor: '#e2e8f0', margin: 0 }} />

              {/* Comments/Replies Mod Console */}
              <div>
                <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.05rem', fontWeight: '700', color: '#3d2b4f', marginBottom: '15px' }}>
                  Replies ({comments.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div 
                        key={comment.id} 
                        style={{ 
                          backgroundColor: '#f7fafc', 
                          padding: '12px 15px', 
                          borderRadius: '8px', 
                          border: '1px solid #edf2f7',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#3d2b4f' }}>{comment.authorName}</span>
                          <span style={{ color: '#888' }}>
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ 
                          fontFamily: 'Montserrat, sans-serif', 
                          fontSize: '0.9rem', 
                          lineHeight: '1.4', 
                          color: '#4a5568', 
                          margin: '0 80px 0 0',
                          whiteSpace: 'pre-wrap' 
                        }}>
                          {comment.content}
                        </p>
                        
                        <button
                          onClick={() => handleDeleteComment(comment.id, comment.authorName, comment.content)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'transparent',
                            color: '#e53e3e',
                            border: '1px solid #e53e3e',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#e53e3e';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#e53e3e';
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i> Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#a0aec0', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      No replies posted on this topic yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '15px 25px', backgroundColor: '#f7fafc', borderTop: '1px solid #edf2f7', textAlign: 'right' }}>
              <button 
                onClick={() => setSelectedPost(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '1px solid #3d2b4f',
                  backgroundColor: '#3d2b4f',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: 'Montserrat, sans-serif',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminForums;
