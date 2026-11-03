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

  useEffect(() => {
    if (selectedLesson) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedLesson]);

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

  const floatingRunes = [
    { symbol: 'A', left: '6%', top: '15%', size: '2.1rem', delay: '0s', dur: '7.5s' },
    { symbol: 'E', left: '92%', top: '18%', size: '1.9rem', delay: '2s', dur: '8.2s' },
    { symbol: 'I', left: '4%', top: '48%', size: '1.7rem', delay: '1s', dur: '9s' },
    { symbol: 'O', left: '94%', top: '55%', size: '2.2rem', delay: '3.2s', dur: '7.6s' },
    { symbol: 'U', left: '7%', top: '82%', size: '1.8rem', delay: '2.4s', dur: '8.5s' },
    { symbol: '✦', left: '16%', top: '8%', size: '1.1rem', delay: '0.6s', dur: '6s' },
    { symbol: '✧', left: '85%', top: '35%', size: '1rem', delay: '3.6s', dur: '6.6s' },
    { symbol: '✦', left: '88%', top: '86%', size: '1.3rem', delay: '1.7s', dur: '7.1s' },
    { symbol: '✧', left: '12%', top: '32%', size: '1.1rem', delay: '2.6s', dur: '8s' },
  ];

  const categoryIcons = {
    'Vocabulary Guide': 'fa-solid fa-spell-check',
    'Grammar Tips': 'fa-solid fa-pen-nib',
    'Practice Exercises': 'fa-solid fa-clipboard-question',
    'Reading Nook': 'fa-solid fa-book-open-reader'
  };

  return (
    <div className="page-bg page-bg--game">
      {/* Floating Magical Vowel Runes */}
      {floatingRunes.map((item, idx) => (
        <span
          key={idx}
          className="game-floating-rune"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.dur,
          }}
          aria-hidden="true"
        >
          {item.symbol}
        </span>
      ))}

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '24px 20px 60px', color: '#fff', position: 'relative', zIndex: 2, textAlign: 'center' }}>
        
        {/* Title Card */}
        <div className="gameplay-info-card" style={{ marginBottom: '35px' }}>
          <span className="gameplay-badge" style={{ marginBottom: '10px' }}>
            <span className="gameplay-badge__letter">✦</span>
            <span>Learning Portal</span>
          </span>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.4rem', marginBottom: '10px', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            Grade 3 English Resources
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
            Explore phonics guides, grammar masterclasses, and reading exercises to sharpen your literacy skills.
          </p>
        </div>
        
        {/* Categories Accordion */}
        <div className="resources-accordion-container">
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
            
            const isExpanded = expandedCategory === category;
            const iconClass = categoryIcons[category] || 'fa-solid fa-book';

            return (
              <div key={category} className={`resources-accordion-item ${isExpanded ? 'active' : ''}`}>
                <div 
                  onClick={() => toggleCategory(category)}
                  className="resources-accordion-header"
                >
                  <div className="resources-accordion-header-left">
                    <span className="resources-category-icon-bubble">
                      <i className={iconClass}></i>
                    </span>
                    <span className="resources-category-title">{category}</span>
                    <span className="resources-count-chip">{categoryLessons.length}</span>
                  </div>
                  <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} resources-chevron`}></i>
                </div>
                
                {/* Lessons List for this Category */}
                {isExpanded && (
                  <div className="resources-lessons-list">
                    {categoryLessons.length > 0 ? (
                      categoryLessons.map(lesson => (
                        <div 
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className="resources-lesson-row"
                        >
                          <div className="resources-lesson-left">
                            <span className="resources-lesson-bullet">
                              <i className="fa-solid fa-book-open"></i>
                            </span>
                            <span className="resources-lesson-name">{lesson.title}</span>
                          </div>
                          <span className="resources-read-btn">
                            Read Lesson
                            <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="resources-empty-hint">
                        <i className="fa-regular fa-folder-open" style={{ fontSize: '1.5rem', marginBottom: '8px', display: 'block' }}></i>
                        No lessons available in this category yet.
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
    </div>
  );
}

export default Resources;
