import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// Robust, lightweight Markdown-to-HTML parser to display rich lesson content beautifully
function parseMarkdownToHTML(text) {
  if (!text) return '';
  
  // Escaping helper to prevent raw HTML injection for safety
  const escapeHTML = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const lines = text.split('\n');
  const html = [];
  let inList = null; // 'ul', 'ol', 'table', or null
  let tableRows = [];

  const parseInline = (str) => {
    let s = escapeHTML(str);
    // Bold: **text**
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics: *text*
    s = s.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return s;
  };

  const closePendingTags = () => {
    if (inList === 'ul') {
      html.push('</ul>');
      inList = null;
    } else if (inList === 'ol') {
      html.push('</ol>');
      inList = null;
    } else if (inList === 'table') {
      html.push('<div class="lesson-table-container"><table class="lesson-table">');
      let isFirst = true;
      tableRows.forEach(row => {
        // Skip separator row (e.g. | :--- | :--- |)
        const isSeparator = row.some(cell => {
          const trimmedCell = cell.trim();
          return trimmedCell.startsWith(':') || (trimmedCell.startsWith('-') && trimmedCell.endsWith('-'));
        });
        if (isSeparator) return;
        
        html.push('<tr>');
        row.forEach(cell => {
          const tag = isFirst ? 'th' : 'td';
          html.push(`<${tag}>${parseInline(cell.trim())}</${tag}>`);
        });
        html.push('</tr>');
        isFirst = false;
      });
      html.push('</table></div>');
      tableRows = [];
      inList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      closePendingTags();
      html.push('<hr class="lesson-hr" />');
      continue;
    }

    // Table line
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList !== 'table') {
        closePendingTags();
        inList = 'table';
      }
      const cells = trimmed.slice(1, -1).split('|');
      tableRows.push(cells);
      continue;
    }

    // Unordered List line: starts with * or - followed by space
    const ulMatch = trimmed.match(/^[\*\-]\s+(.*)/);
    if (ulMatch) {
      if (inList !== 'ul') {
        closePendingTags();
        inList = 'ul';
        html.push('<ul class="lesson-ul">');
      }
      html.push(`<li>${parseInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered List line: starts with number followed by . and space
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (inList !== 'ol') {
        closePendingTags();
        inList = 'ol';
        html.push('<ol class="lesson-ol">');
      }
      html.push(`<li>${parseInline(olMatch[2])}</li>`);
      continue;
    }

    // Empty line
    if (trimmed === '') {
      closePendingTags();
      html.push('<div class="lesson-spacer"></div>');
      continue;
    }

    // Regular paragraph or header (if it has bold style covering the whole line, or is just text)
    closePendingTags();
    
    // Check if the whole line is wrapped in bold and starts a section (e.g. **Title**)
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
      const headerText = trimmed.slice(2, -2);
      html.push(`<h4 class="lesson-h4">${parseInline(headerText)}</h4>`);
    } else {
      html.push(`<p class="lesson-p">${parseInline(line)}</p>`);
    }
  }

  closePendingTags();
  return html.join('\n');
}

function Resources() {
  const [cmsLessons, setCmsLessons] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setExpandedCategory(catParam);
    } else {
      const hashParam = decodeURIComponent(location.hash.substring(1));
      const categories = [
        "Vocabulary Guide",
        "Grammar Tips",
        "Practice Exercises",
        "Reading Nook"
      ];
      if (categories.includes(hashParam)) {
        setExpandedCategory(hashParam);
      }
    }
  }, [location]);

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
      <div 
        className="category-accordion-wrapper"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          backgroundColor: '#f5e6d3',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
      >
        {resourceCategories.map((category, index) => {
          const categoryLessons = cmsLessons
            .filter(l => (l.category || 'Vocabulary Guide') === category)
            .sort((a, b) => {
              // 1. Sort by explicit order field first
              const orderA = a.order !== undefined ? parseInt(a.order, 10) : null;
              const orderB = b.order !== undefined ? parseInt(b.order, 10) : null;
              
              if (orderA !== null && orderB !== null) {
                if (orderA !== orderB) return orderA - orderB;
              } else if (orderA !== null) {
                return -1;
              } else if (orderB !== null) {
                return 1;
              }

              // 2. Extract lesson number from title (e.g. "Lesson 1", "Lesson 2", etc.)
              const matchA = (a.title || '').match(/(\d+)/);
              const matchB = (b.title || '').match(/(\d+)/);
              const numA = matchA ? parseInt(matchA[1], 10) : Infinity;
              const numB = matchB ? parseInt(matchB[1], 10) : Infinity;
              if (numA !== numB) return numA - numB;
              
              // 3. Fallback: alphabetical by title
              return (a.title || '').localeCompare(b.title || '');
            });
          
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
          padding: '12px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'clamp(15px, 4vw, 20px)',
              backgroundColor: '#3d2b4f',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontFamily: 'Berkshire Swash, cursive', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#e0c3fc' }}>
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
              padding: 'clamp(15px, 5vw, 30px)',
              overflowY: 'auto',
              color: '#333',
              textAlign: 'left',
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.6'
            }}>
              {selectedLesson.contentText ? (
                selectedLesson.contentText.startsWith('http') ? (
                  <a href={selectedLesson.contentText} target="_blank" rel="noopener noreferrer" style={{ color: '#d4854a', fontWeight: 'bold' }}>
                    Click here to open the link
                  </a>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(selectedLesson.contentText) }} />
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
