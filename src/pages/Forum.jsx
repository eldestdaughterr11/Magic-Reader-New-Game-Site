import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, deleteDoc, where, updateDoc, getDocs } from 'firebase/firestore';

function Forum() {
  const [posts, setPosts] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  // Modals & Forms state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    content: ''
  });
  
  // Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['General', 'Game Help', 'Feedback', 'Study Group'];

  // Fetch current user profile name from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUserProfile(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching user profile: ", err);
        }
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch all forum posts in real-time
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

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (isCreateModalOpen || selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen, selectedPost]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and Content are required!");
      return;
    }

    const user = auth.currentUser;
    const authorName = currentUserProfile?.name || user?.email || 'Magic Learner';

    try {
      await addDoc(collection(db, 'forums'), {
        title: formData.title.trim(),
        category: formData.category,
        content: formData.content.trim(),
        authorId: user.uid,
        authorName: authorName,
        createdAt: new Date().toISOString(),
        commentsCount: 0
      });

      // Log activity to Firestore
      await addDoc(collection(db, 'activities'), {
        action: `Posted Forum: ${formData.title.trim()}`,
        user: authorName,
        timestamp: new Date().toISOString()
      });

      setFormData({ title: '', category: 'General', content: '' });
      setIsCreateModalOpen(false);
      alert("Forum post created successfully!");
    } catch (err) {
      console.error("Error creating post: ", err);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const user = auth.currentUser;
    const authorName = currentUserProfile?.name || user?.email || 'Magic Learner';

    try {
      // Add comment document
      await addDoc(collection(db, 'forum_comments'), {
        forumId: selectedPost.id,
        content: newCommentText.trim(),
        authorId: user.uid,
        authorName: authorName,
        createdAt: new Date().toISOString()
      });

      // Update comments count on the post
      const postRef = doc(db, 'forums', selectedPost.id);
      const newCount = (selectedPost.commentsCount || 0) + 1;
      await updateDoc(postRef, {
        commentsCount: newCount
      });

      // Update local state to reflect new comment count in modal
      setSelectedPost(prev => ({
        ...prev,
        commentsCount: newCount
      }));

      setNewCommentText('');
    } catch (err) {
      console.error("Error adding comment: ", err);
      alert("Failed to add comment.");
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (window.confirm(`Are you sure you want to delete your forum post "${postTitle}"?`)) {
      try {
        // 1. Fetch and delete comments/replies associated with the post
        const commentsQuery = query(collection(db, 'forum_comments'), where('forumId', '==', postId));
        const commentsSnapshot = await getDocs(commentsQuery);
        const deletePromises = commentsSnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
        await Promise.all(deletePromises);

        // 2. Delete the post itself
        await deleteDoc(doc(db, 'forums', postId));
        
        setSelectedPost(null);
        alert("Post deleted successfully.");
      } catch (err) {
        console.error("Error deleting post: ", err);
        alert("Failed to delete post.");
      }
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', color: '#fff' }}>
      
      {/* Page Title */}
      <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.8rem', color: '#e0c3fc', marginBottom: '10px', textAlign: 'center', fontWeight: '400' }}>
        Community Forums
      </h2>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', color: '#f5e6d3', textAlign: 'center', marginBottom: '40px' }}>
        Connect, ask questions, share stories, and study together!
      </p>

      {/* Toolbar */}
      <div className="forum-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
          <input 
            type="text" 
            placeholder="Search discussions, authors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 45px',
              borderRadius: '25px',
              border: '1px solid #d1a7d1',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1rem',
              fontFamily: 'Montserrat, sans-serif'
            }}
          />
        </div>

        {/* New Thread Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            backgroundColor: '#d4854a',
            color: '#fff',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '25px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(212, 133, 74, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c5743b'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d4854a'}
        >
          <i className="fa-solid fa-plus"></i> New Discussion
        </button>
      </div>

      {/* Category Pills */}
      <div className="category-pills-container">
        <button 
          onClick={() => setActiveCategory('All')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: '1px solid #d1a7d1',
            backgroundColor: activeCategory === 'All' ? '#e0c3fc' : 'transparent',
            color: activeCategory === 'All' ? '#3d2b4f' : '#fff',
            fontWeight: 'bold',
            fontFamily: 'Montserrat, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          All Topics
        </button>
        {categories.map(category => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: '1px solid #d1a7d1',
              backgroundColor: activeCategory === category ? '#e0c3fc' : 'transparent',
              color: activeCategory === category ? '#3d2b4f' : '#fff',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Discussion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div 
              key={post.id}
              onClick={() => setSelectedPost(post)}
              style={{
                backgroundColor: '#4a3b5a',
                borderRadius: '15px',
                padding: '25px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.backgroundColor = '#534267';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.backgroundColor = '#4a3b5a';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '10px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  backgroundColor: '#e0c3fc',
                  color: '#3d2b4f',
                  textTransform: 'uppercase'
                }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#f5e6d3' }}>
                  {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
                {post.title}
              </h3>
              
              <p style={{ 
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: '0.95rem', 
                color: '#ddd', 
                lineHeight: '1.6',
                marginBottom: '20px',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {post.content}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-regular fa-circle-user" style={{ fontSize: '1.1rem', color: '#e0c3fc' }}></i>
                  <span style={{ fontSize: '0.9rem', color: '#e0c3fc', fontWeight: '600' }}>{post.authorName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5e6d3' }}>
                  <i className="fa-regular fa-comment-dots" style={{ fontSize: '1.1rem' }}></i>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{post.commentsCount || 0} Replies</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <i className="fa-solid fa-comments" style={{ fontSize: '3rem', color: '#e0c3fc', marginBottom: '15px' }}></i>
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.2rem', marginBottom: '10px' }}>No discussions found</h3>
            <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Be the first to start a conversation in the community!</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px'
        }}>
          <div style={{
            backgroundColor: '#4a3b5a',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 'clamp(15px, 5vw, 30px)',
            border: '1px solid #d1a7d1',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontFamily: 'Berkshire Swash, cursive', fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', color: '#e0c3fc', textAlign: 'center' }}>
              Create New Discussion
            </h3>

            <form onSubmit={handleCreatePost}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Topic Title</label>
                <input 
                  type="text"
                  placeholder="Enter a descriptive title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '1rem',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '1rem',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Message Body</label>
                <textarea 
                  placeholder="Share your thoughts, questions, or ideas with the community..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '12px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: '1px solid #fff',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '10px 25px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#d4854a',
                    color: '#fff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discussion Detail / Thread Modal */}
      {selectedPost && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '12px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            color: '#333'
          }}>
            
            {/* Modal Header */}
            <div style={{
              padding: '20px 25px',
              backgroundColor: '#3d2b4f',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                backgroundColor: '#e0c3fc',
                color: '#3d2b4f',
                textTransform: 'uppercase'
              }}>
                {selectedPost.category}
              </span>
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

            {/* Modal Scrollable Body */}
            <div style={{ padding: 'clamp(15px, 5vw, 30px)', overflowY: 'auto', flex: '1', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Original Post */}
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.4rem', fontWeight: '700', color: '#3d2b4f', marginBottom: '12px', lineHeight: '1.3' }}>
                  {selectedPost.title}
                </h3>
                
                <div style={{ display: 'flex', justifySelf: 'start', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-regular fa-circle-user" style={{ fontSize: '1.1rem', color: '#d4854a' }}></i>
                    <span style={{ fontSize: '0.85rem', color: '#d4854a', fontWeight: '700' }}>{selectedPost.authorName}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(selectedPost.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  color: '#444',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#fcf8ff',
                  padding: '20px',
                  borderRadius: '10px',
                  borderLeft: '4px solid #3d2b4f'
                }}>
                  {selectedPost.content}
                </p>

                {/* Self Delete Button */}
                {auth.currentUser && auth.currentUser.uid === selectedPost.authorId && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      onClick={() => handleDeletePost(selectedPost.id, selectedPost.title)}
                      style={{
                        backgroundColor: '#e53e3e',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        fontFamily: 'Montserrat, sans-serif',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Delete Topic
                    </button>
                  </div>
                )}
              </div>

              <hr style={{ border: 0, height: '1px', backgroundColor: '#e2e8f0', margin: '5px 0' }} />

              {/* Replies Section */}
              <div>
                <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.1rem', fontWeight: '700', color: '#3d2b4f', marginBottom: '15px' }}>
                  Replies ({comments.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} style={{ backgroundColor: '#f7fafc', padding: '15px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 'bold', color: '#3d2b4f' }}>{comment.authorName}</span>
                          <span style={{ color: '#888' }}>
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', lineHeight: '1.5', color: '#444', whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      No replies yet. Join the conversation below!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Comment Form Input */}
            <div style={{ padding: 'clamp(15px, 4vw, 20px) 25px', backgroundColor: '#f7fafc', borderTop: '1px solid #edf2f7' }}>
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text"
                  placeholder="Write a supportive reply..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  style={{
                    flex: '1',
                    padding: '12px 15px',
                    borderRadius: '25px',
                    border: '1px solid #cbd5e0',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '0.95rem',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                  required
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#3d2b4f',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '90px'
                  }}
                >
                  Reply
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Forum;
