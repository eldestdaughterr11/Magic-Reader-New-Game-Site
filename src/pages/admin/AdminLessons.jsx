import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ 
    title: '', 
    status: 'Draft',
    category: 'Vocabulary Guide',
    contentText: '',
    order: 1
  });

  const handleSeedMatatag = async () => {
    if (window.confirm("Are you sure you want to load the MATATAG Curriculum Grade 3 English materials? This will add standard lessons into your database without duplicating existing ones.")) {
      setIsSeeding(true);
      try {
        let addedCount = 0;
        for (const matatagLesson of matatagLessons) {
          // Check if this lesson already exists in the lessons array loaded from Firestore
          const exists = lessons.some(
            (lesson) => lesson.title.toLowerCase() === matatagLesson.title.toLowerCase()
          );

          if (!exists) {
            await addDoc(collection(db, 'lessons'), {
              ...matatagLesson,
              createdAt: new Date().toISOString()
            });
            addedCount++;
          }
        }
        
        if (addedCount > 0) {
          alert(`Successfully seeded ${addedCount} MATATAG Curriculum lessons!`);
        } else {
          alert("All MATATAG Curriculum lessons are already loaded!");
        }
      } catch (err) {
        console.error("Error seeding MATATAG lessons: ", err);
        alert("Failed to seed MATATAG lessons. Please try again.");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  useEffect(() => {
    // Real-time listener using Firebase onSnapshot
    const q = query(collection(db, 'lessons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort in frontend: Category first, then Order asc, then createdAt desc
      lessonsData.sort((a, b) => {
        if (a.category !== b.category) {
          return (a.category || '').localeCompare(b.category || '');
        }
        const orderA = a.order !== undefined ? parseInt(a.order, 10) : 1;
        const orderB = b.order !== undefined ? parseInt(b.order, 10) : 1;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
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

  const handleArchive = async (lesson) => {
    const isArchived = lesson.status === 'Archived';
    const action = isArchived ? 'restore' : 'archive';
    if (window.confirm(`Are you sure you want to ${action} "${lesson.title}"?`)) {
      try {
        const lessonRef = doc(db, 'lessons', lesson.id);
        await updateDoc(lessonRef, { status: isArchived ? 'Draft' : 'Archived' });
        alert(`Lesson "${lesson.title}" has been ${isArchived ? 'restored to Draft' : 'archived'}.`);
      } catch (err) {
        console.error('Error archiving document: ', err);
        alert('Failed to update lesson status.');
      }
    }
  };

  const handleOpenModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({ 
        title: lesson.title || '', 
        status: lesson.status || 'Draft',
        category: lesson.category || 'Vocabulary Guide',
        contentText: lesson.contentText || '',
        order: lesson.order !== undefined ? parseInt(lesson.order, 10) : 1
      });
    } else {
      setEditingLesson(null);
      setFormData({ 
        title: '', 
        status: 'Draft',
        category: 'Vocabulary Guide',
        contentText: '',
        order: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
    setFormData({ title: '', status: 'Draft', category: 'Vocabulary Guide', contentText: '', order: 1 });
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
          status: formData.status,
          category: formData.category,
          contentText: formData.contentText,
          order: parseInt(formData.order, 10) || 1
        });
        alert('Lesson updated successfully.');
      } else {
        // Add new to Firebase
        await addDoc(collection(db, 'lessons'), {
          title: formData.title,
          status: formData.status,
          category: formData.category,
          contentText: formData.contentText,
          order: parseInt(formData.order, 10) || 1,
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

  const activeLessons = lessons.filter(l => l.status !== 'Archived');
  const archivedLessons = lessons.filter(l => l.status === 'Archived');
  const displayedLessons = showArchived ? archivedLessons : activeLessons;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 className="admin-page-title" style={{ margin: 0 }}>Manage Lessons</h2>
          <button
            className="cms-btn"
            style={{
              backgroundColor: showArchived ? 'rgba(243,156,18,0.15)' : 'rgba(255,255,255,0.08)',
              color: showArchived ? '#f39c12' : '#ccc',
              border: `1px solid ${showArchived ? '#f39c12' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              padding: '6px 12px'
            }}
            onClick={() => setShowArchived(prev => !prev)}
          >
            <i className={showArchived ? 'fa-solid fa-box-open' : 'fa-solid fa-box-archive'}></i>
            {showArchived ? `Active (${activeLessons.length})` : `Archived (${archivedLessons.length})`}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!showArchived && (
            <>
              <button 
                className="cms-btn" 
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: '#fff', 
                  border: '1px solid #60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }} 
                onClick={handleSeedMatatag}
                disabled={isSeeding}
              >
                <i className={isSeeding ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-cloud-arrow-down"}></i>
                {isSeeding ? 'Loading...' : 'Load MATATAG Materials'}
              </button>
              <button className="cms-btn cms-btn-primary" onClick={() => handleOpenModal()}>
                <i className="fa-solid fa-plus"></i> Add New Lesson
              </button>
            </>
          )}
        </div>
      </div>

      <div className="cms-card admin-table-wrapper" style={{ overflowX: 'auto', margin: 0 }}>
        <table className="cms-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Lesson Title</th>
              <th>Category</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedLessons.map(lesson => (
              <tr key={lesson.id}>
                <td style={{ fontSize: '0.8em', color: '#ccc' }}>{lesson.id.substring(0, 5)}...</td>
                <td><strong>{lesson.title}</strong></td>
                <td>{lesson.category || 'N/A'}</td>
                <td>{lesson.order !== undefined ? lesson.order : 1}</td>
                <td>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: lesson.status === 'Published' ? 'rgba(72, 187, 120, 0.2)' : lesson.status === 'Archived' ? 'rgba(156,163,175,0.2)' : 'rgba(243, 156, 18, 0.2)',
                    color: lesson.status === 'Published' ? '#a8e6cf' : lesson.status === 'Archived' ? '#9ca3af' : '#f39c12'
                  }}>
                    {lesson.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {!showArchived && (
                    <button 
                      className="cms-btn cms-btn-warning" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      onClick={() => handleOpenModal(lesson)}
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    className="cms-btn" 
                    style={{ 
                      padding: '5px 10px', 
                      fontSize: '0.8rem',
                      backgroundColor: showArchived ? 'rgba(72,187,120,0.15)' : 'rgba(156,163,175,0.15)',
                      color: showArchived ? '#a8e6cf' : '#9ca3af',
                      border: `1px solid ${showArchived ? 'rgba(72,187,120,0.4)' : 'rgba(156,163,175,0.4)'}`
                    }}
                    onClick={() => handleArchive(lesson)}
                  >
                    <i className={showArchived ? 'fa-solid fa-box-open' : 'fa-solid fa-box-archive'} style={{ marginRight: '4px' }}></i>
                    {showArchived ? 'Restore' : 'Archive'}
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
            {displayedLessons.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  {showArchived ? 'No archived lessons.' : 'No lessons found. Create one now!'}
                </td>
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
          zIndex: 1000,
          padding: '15px'
        }}>
          <div className="cms-card" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0c3fc', fontWeight: 'bold' }}>Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                >
                  <option value="Vocabulary Guide">Vocabulary Guide</option>
                  <option value="Grammar Tips">Grammar Tips</option>
                  <option value="Practice Exercises">Practice Exercises</option>
                  <option value="Reading Nook">Reading Nook</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0c3fc', fontWeight: 'bold' }}>Lesson Order (e.g., 1-4)</label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value, 10) || 1})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e0c3fc', fontWeight: 'bold' }}>Content / Link</label>
                <textarea 
                  value={formData.contentText}
                  onChange={(e) => setFormData({...formData, contentText: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333', minHeight: '80px', fontFamily: 'inherit' }}
                  placeholder="Enter text description, instructions, or paste a link..."
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

const rawMatatagLessons = [
  {
    title: "Lesson 1: Using Context Clues",
    category: "Vocabulary Guide",
    status: "Published",
    contentText: `**Grade 3 English - Vocabulary Guide**

**Objective:**
Identify the meaning of unfamiliar words using context clues (synonyms, antonyms, definition, and examples) in sentences.

**What are Context Clues?**
Context clues are hints found within a sentence, paragraph, or passage that a reader can use to understand the meanings of new or unfamiliar words.

**Types of Context Clues:**
1. **Definition / Explanation Clue:** The word is defined directly in the sentence.
   *Example:* "The *dermatologist*, a doctor who specializes in skin care, helped heal Sarah's rash."
2. **Synonym / Restatement Clue:** The sentence uses a similar word that you might know.
   *Example:* "The classroom was *orderly* and neat, with all books placed on the shelves." (Orderly means neat)
3. **Antonym / Contrast Clue:** The sentence shows the opposite meaning using words like *but*, *however*, *unlike*.
   *Example:* "Unlike his sister who is very *loquacious*, Carlos is quiet and rarely speaks." (Loquacious means talkative, the opposite of quiet)
4. **Example Clue:** The sentence provides examples that show the meaning of the word.
   *Example:* "Vehicles such as *tricycles*, *jeepneys*, and *buses* are common in the Philippines." (Vehicles are things used for transport)

**Practice Activity:**
Read the sentences and guess the meaning of the underlined words based on the context clues!
1. The teacher was *jubilant* when all her students passed the test. (Jubilant means: _____________)
2. The weather was *dreadful*; it was rainy, windy, and extremely cold. (Dreadful means: _____________)`
  },
  {
    title: "Lesson 2: Synonyms and Antonyms",
    category: "Vocabulary Guide",
    status: "Published",
    contentText: `**Grade 3 English - Vocabulary Guide**

**Objective:**
Differentiate between synonyms and antonyms, and use them to expand vocabulary.

**1. Synonyms (Mga Kasingkahulugan)**
Synonyms are words that have the same or very similar meanings.
*Examples:*
*   **Large** - Huge / Big
*   **Beautiful** - Pretty / Gorgeous
*   **Happy** - Glad / Joyful
*   **Quick** - Fast / Rapid
*   **Smart** - Intelligent / Wise

*Sentence Example:*
*   "The puppy is very **small**." -> "The puppy is very **tiny**." (Small and tiny are synonyms)

**2. Antonyms (Mga Kasalungat)**
Antonyms are words that have opposite meanings.
*Examples:*
*   **Hot** - Cold
*   **Up** - Down
*   **Fast** - Slow
*   **Heavy** - Light
*   **Bright** - Dark / Dull

*Sentence Example:*
*   "The tea is too **hot** to drink." -> "The ice water is **cold**." (Hot and cold are antonyms)

**Filipino Culture Connection (MATATAG Integration):**
In the Philippines, we practice **Bayanihan** (cooperation).
*   *Synonyms for cooperation:* Collaboration, helping hand, unity.
*   *Antonyms for cooperation:* Selfishness, division, conflict.

**Fun Challenge:**
Can you name the antonym for "brave"? (Clue: Starts with 'c')`
  },
  {
    title: "Lesson 3: Understanding Homographs",
    category: "Vocabulary Guide",
    status: "Published",
    contentText: `**Grade 3 English - Vocabulary Guide**

**Objective:**
Recognize and understand homographs (words with the same spelling but different meanings and sometimes pronunciations) in reading selections.

**What is a Homograph?**
*Homo* means "same" and *graph* means "writing". Homographs are words that are spelled exactly the same way, but have different meanings.

**Common Examples of Homographs:**

1. **Bat**
   *   *Meaning A:* A flying mammal that is active at night.
       *Example:* "We saw a **bat** fly out of the cave at dusk."
   *   *Meaning B:* A wooden club used in sports like baseball.
       *Example:* "He hit the ball hard with his wooden **bat**."

2. **Bow**
   *   *Meaning A:* A knot tied with loops, or a weapon for shooting arrows.
       *Example:* "She wore a red **bow** in her hair."
   *   *Meaning B:* To bend forward at the waist as a sign of respect.
       *Example:* "We must **bow** to the elders as a sign of respect."

3. **Bark**
   *   *Meaning A:* The outer covering of a tree.
       *Example:* "The **bark** of the narra tree is rough."
   *   *Meaning B:* The sound made by a dog.
       *Example:* "I heard our dog **bark** at the stranger."

**Practice:**
Read the sentences carefully. Write which meaning of the homograph is being used!
*   "Please turn **left** at the corner." (Left means: Direction / Went away)
*   "She has **left** the room." (Left means: Direction / Went away)`
  },
  {
    title: "Lesson 1: Common and Proper Nouns",
    category: "Grammar Tips",
    status: "Published",
    contentText: `**Grade 3 English - Grammar Tips**

**Objective:**
Distinguish between common and proper nouns and apply correct capitalization rules.

**What is a Noun?**
A noun (Pangngalan) is a name of a person, place, thing, animal, or event.

There are two main types of nouns:
1. **Common Nouns (Pangngalang Pambalana):**
   *   These are general names of people, places, things, etc.
   *   They start with a lowercase letter (maliliit na titik) unless they are at the beginning of a sentence.
   *   *Examples:* teacher, school, dog, country, holiday.

2. **Proper Nouns (Pangngalang Pantangi):**
   *   These are specific names of people, places, things, etc.
   *   They **ALWAYS** start with a capital letter (malalaking titik).
   *   *Examples:* Teacher Maria, The Sound Keeper School, Bruno, Philippines, Christmas Day.

**Comparison Table:**
| Common Noun | Proper Noun |
| :--- | :--- |
| teacher | Mrs. Alona Santos |
| ocean | Pacific Ocean |
| country | Philippines |
| day | Monday |
| language | English / Filipino |

**Rule of Thumb:**
Always capitalize Proper Nouns! For example:
*   *Incorrect:* I live in the philippines.
*   *Correct:* I live in the **Philippines**.`
  },
  {
    title: "Lesson 2: Verb Tenses (Action Words)",
    category: "Grammar Tips",
    status: "Published",
    contentText: `**Grade 3 English - Grammar Tips**

**Objective:**
Identify and use the simple tenses of verbs (past, present, and future) in sentences.

**What is a Verb?**
A verb (Pandiwa) is an action word. It tells us what someone or something is doing.

**The Three Simple Tenses:**

1. **Past Tense (Naganap Na):**
   *   Tells about an action that already happened in the past.
   *   *Keywords:* yesterday, last night, earlier, last year.
   *   *Rule:* Usually formed by adding **-d** or **-ed** to the base verb (or changing spelling for irregular verbs).
   *   *Examples:* walked, played, ate (from eat), sang (from sing).
   *   *Sentence:* "We **cleaned** our backyard yesterday."

2. **Present Tense (Nagaganap Pa):**
   *   Tells about an action that is happening now or happens regularly.
   *   *Keywords:* today, every day, right now, always.
   *   *Rule:* Add **-s** or **-es** if the subject is singular (he/she/it). Use the base form if the subject is plural (they/we/I/you).
   *   *Examples:* walks/walk, plays/play, eats/eat.
   *   *Sentence:* "Ana **sweeps** the floor every morning."

3. **Future Tense (Gaganapin Pa):**
   *   Tells about an action that will happen in the future.
   *   *Keywords:* tomorrow, next week, later, next year.
   *   *Rule:* Use **will** or **shall** before the base form of the verb.
   *   *Examples:* will walk, will play, will eat.
   *   *Sentence:* "Kuya Marc **will plant** trees tomorrow."`
  },
  {
    title: "Lesson 3: Describing with Adjectives",
    category: "Grammar Tips",
    status: "Published",
    contentText: `**Grade 3 English - Grammar Tips**

**Objective:**
Identify adjectives (describing words) and use them to describe people, places, animals, and things.

**What is an Adjective?**
An adjective (Pang-uri) is a word that describes a noun or a pronoun. It tells us more about a person, place, or thing.

Adjectives can describe:
1. **Color:** *red* apple, *yellow* mango, *blue* sky.
2. **Size:** *huge* whale, *tiny* ant, *tall* tree.
3. **Shape:** *round* ball, *square* table, *flat* surface.
4. **Number:** *three* books, *many* stars, *several* classmates.
5. **Quality/Feeling:** *kind* teacher, *happy* child, *warm* soup.

**Filipino Culture Example (MATATAG Integration):**
Let's describe our famous Philippine jeepney!
*   "The **colorful** jeepney drives down the **busy** street."
*   *Adjectives:* **colorful** (describes jeepney), **busy** (describes street).

**Exercise:**
Underline the adjectives in the sentences:
1. The sweet mangoes are delicious.
2. We saw two little birds on the branch.
3. Our mother has a kind heart.`
  },
  {
    title: "Lesson 4: Subject-Verb Agreement Rules",
    category: "Grammar Tips",
    status: "Published",
    contentText: `**Grade 3 English - Grammar Tips**

**Objective:**
Apply basic rules of subject-verb agreement in writing and speaking.

**The Golden Rule:**
*   **Singular Subject** -> Needs a **Singular Verb** (usually ends in **-s** or **-es**).
*   **Plural Subject** -> Needs a **Plural Verb** (base form, does NOT end in **-s**).

**1. Singular Subjects:**
When the subject is only ONE person, place, or thing:
*   *Subject:* The teacher (one person)
*   *Verb:* teaches (ends in -s)
*   *Sentence:* "The teacher **teaches** Grade 3 students."

**2. Plural Subjects:**
When the subject is TWO or more people, places, or things:
*   *Subject:* The teachers (more than one person)
*   *Verb:* teach (no -s)
*   *Sentence:* "The teachers **teach** the children."

**3. Pronoun Exceptions:**
*   **I** and **You** are special! They always take the plural/base form of the verb.
    *   *I* **sing** a song. (NOT: I sings)
    *   *You* **look** beautiful. (NOT: You looks)

**Let's Practice! Choose the correct verb:**
1. My brother (helps, help) me with my homework.
2. The children (plays, play) in the playground.
3. She (waters, water) the plants every afternoon.`
  },
  {
    title: "Exercise 1: Check Your Verb Tenses!",
    category: "Practice Exercises",
    status: "Published",
    contentText: `**Grade 3 English - Practice Exercises**

**Objective:**
Test your knowledge of past, present, and future verb tenses.

**Instructions:** Choose the correct form of the verb in parentheses to complete each sentence. Write your answers on a sheet of paper.

1. Yesterday, Lito ________ (find, found, will find) a shiny coin in the garden.
2. She ________ (writes, wrote, will write) a letter to her grandmother every week.
3. Tomorrow, our class ________ (visits, visited, will visit) the local museum.
4. Mother ________ (bakes, baked, will bake) a delicious cake last Sunday.
5. The sun ________ (shines, shone, will shine) brightly in the sky today.
6. Next month, we ________ (travel, traveled, will travel) to Boracay with my family.

**Answer Key:**
1. **found** (past tense, indicated by "Yesterday")
2. **writes** (present tense, singular subject "She", indicated by "every week")
3. **will visit** (future tense, indicated by "Tomorrow")
4. **baked** (past tense, indicated by "last Sunday")
5. **shines** (present tense, singular subject "sun", indicated by "today")
6. **will travel** (future tense, indicated by "Next month")`
  },
  {
    title: "Exercise 2: Synonyms & Antonyms Match",
    category: "Practice Exercises",
    status: "Published",
    contentText: `**Grade 3 English - Practice Exercises**

**Objective:**
Identify synonyms (same meanings) and antonyms (opposite meanings) for common adjectives.

**Part A: Synonyms Match**
Find the word in Column B that has the SAME meaning as the word in Column A.

| Column A | Column B | Answers |
| :--- | :--- | :--- |
| 1. Glad | A. Fast | 1. [   ] |
| 2. Quick | B. Smart | 2. [   ] |
| 3. Intelligent | C. Happy | 3. [   ] |
| 4. Neat | D. Large | 4. [   ] |
| 5. Huge | E. Tidy | 5. [   ] |

**Part B: Antonyms Match**
Find the word in Column B that has the OPPOSITE meaning of the word in Column A.

| Column A | Column B | Answers |
| :--- | :--- | :--- |
| 1. Loud | A. Slow | 1. [   ] |
| 2. Quick | B. Heavy | 2. [   ] |
| 3. Light | C. Quiet | 3. [   ] |
| 4. Weak | D. Dark | 4. [   ] |
| 5. Bright | E. Strong | 5. [   ] |

**Answer Key:**
*Part A:* 1-C (Happy), 2-A (Fast), 3-B (Smart), 4-E (Tidy), 5-D (Large)
*Part B:* 1-C (Quiet), 2-A (Slow), 3-B (Heavy), 4-E (Strong), 5-D (Dark)`
  },
  {
    title: "Exercise 3: Reading: 'The Helpful Ant'",
    category: "Practice Exercises",
    status: "Published",
    contentText: `**Grade 3 English - Practice Exercises**

**Objective:**
Improve reading comprehension, sequence events, and answer questions about a short narrative text.

**Read the story carefully:**

**The Helpful Ant**
One sunny afternoon, a tiny ant named Andy was searching for food near a river. Suddenly, a strong gust of wind blew him into the water. Andy tried hard to swim, but the water was too deep and fast. He was very scared!
Up on a mango tree, a gentle dove named Lily saw Andy struggling in the water. Lily quickly plucked a green leaf and dropped it near the ant. Andy climbed onto the leaf and floated safely to the dry shore.
"Thank you, Lily! You saved my life!" Andy said.
A few days later, a hunter came to the forest. He saw Lily resting on the branch and aimed his slingshot at her. Andy saw this and knew he had to help. He ran quickly and bit the hunter's heel hard. "Ouch!" cried the hunter, dropping his slingshot. Lily heard the noise and quickly flew away to safety.

---

**Comprehension Questions:**
1. Who are the characters in the story?
2. What happened to Andy the ant when he was searching for food?
3. How did Lily the dove help Andy?
4. How did Andy return the favor to Lily later?
5. What is the moral lesson of the story?

**Answer Key:**
1. Andy (the ant), Lily (the dove), and the hunter.
2. He was blown into the river by a strong gust of wind.
3. Lily plucked a leaf and dropped it near Andy so he could float safely to shore.
4. Andy bit the hunter's heel, making him miss his aim at Lily, saving her life.
5. "A kind deed is returned with kindness" or "Helpfulness leads to safety for all."`
  },
  {
    title: "Story 1: The Magic of Juan's Kindness",
    category: "Reading Nook",
    status: "Published",
    contentText: `**Grade 3 English - Reading Nook**

**Theme:** Kindness, Respect, and Filipino Family Values (MATATAG Aligned)

**The Magic of Juan's Kindness**
*Written for Grade 3 Learners*

In a small barangay at the foot of Mount Makiling lived a nine-year-old boy named Juan. Juan was not rich, but he had a heart full of joy and respect. Every morning, before heading to school, he would kiss the hands of his parents (Pagmamano) and say, "Opo, Father. Opo, Mother. I will study hard today."

One afternoon while walking home, Juan saw an old woman struggling to carry a heavy basket filled with ripe starapples (estraywberry/lanzones). She looked very tired and hot under the afternoon sun.

Without hesitation, Juan ran to her side. "Magandang hapon po, Lola," Juan said politely. "May I help you carry your basket? We are walking in the same direction."

Lola Rosa smiled warmly. "Thank you, young boy. That is very kind of you."

As they walked, Juan listened carefully as Lola Rosa shared stories about how the barangay used to be green and quiet. When they reached her house, Lola Rosa opened her basket and handed Juan three shiny red starapples.

"Here, Juan. These are sweet and fresh. Thank you for your helping hand. Remember, kindness is like magic. When you share it, it grows and brings happiness back to you."

Juan thanked Lola Rosa and ran home to share the fruits with his little sister, Nina. He realized that Lola Rosa was right. Helping others made his own heart feel warm and light.

**Think and Discuss:**
1. What respectful gesture did Juan do before going to school?
2. How did Juan help Lola Rosa?
3. What did Lola Rosa give Juan as a token of appreciation?
4. In what ways can you show kindness to others in your school or barangay?`
  },
  {
    title: "Story 2: Si Pagong at si Matsing",
    category: "Reading Nook",
    status: "Published",
    contentText: `**Grade 3 English - Reading Nook**

**Theme:** Wisdom, Fairness, and Character Behavior (Filipino Fable)

**The Monkey and the Tortoise (Si Pagong at si Matsing)**
*Retold for Grade 3 English Learners*

Once upon a time, there were two friends: Pagong the tortoise and Matsing the monkey. One day, they found a beautiful banana tree floating in the river.

"Let us divide it!" suggested Pagong.

Matsing, who was greedy and strong, insisted on taking the upper half of the tree because it had leaves and green bananas. "I want this part because it looks beautiful and will grow faster!" he claimed. Pagong was left with the bottom half, which had only roots and dirt.

They both went home and planted their shares. Matsing planted his leafy top in the ground, but soon it dried up and died because it had no roots. Pagong planted his root section carefully in rich soil and watered it every day. Soon, a healthy banana tree grew tall and bore sweet, yellow fruit.

Matsing saw this and felt jealous. Since Pagong could not climb the tall tree, Matsing offered to help. "I will climb the tree and harvest the bananas for you, my friend!" he said.

But once Matsing got to the top, he started eating all the ripe bananas himself! He threw only the skins down at Pagong.

Pagong felt betrayed and sad. He decided to teach Matsing a lesson. He gathered sharp thorns and placed them all around the trunk of the banana tree. When Matsing tried to slide down, the thorns pricked him painfully. "Ouch! Ouch!" screamed Matsing, realizing his greediness had brought him trouble.

From that day on, Matsing learned that taking advantage of others only leads to loss, while honesty and hard work bring rewards.

**Think and Discuss:**
1. Why did Matsing choose the upper half of the banana tree?
2. What happened to Matsing's plant? What about Pagong's?
3. How did Matsing show greed when he climbed Pagong's banana tree?
4. What is the moral lesson of this classic Filipino story?`
  },
  {
    title: "Story 3: The Feast of Lanzones",
    category: "Reading Nook",
    status: "Published",
    contentText: `**Grade 3 English - Reading Nook**

**Theme:** Cooperation (Bayanihan), Cultural Celebrations, and Gratitude

**The Feast of Lanzones**
*Written for Grade 3 English Learners*

Every year in the beautiful island of Camiguin, people celebrate the Lanzones Festival. It is a colorful event to give thanks for a bountiful harvest of the sweetest lanzones fruit.

This year, young Clara and her family were busy preparing for the barangay street-dance competition. The theme of their dance was "Bayanihan" - the traditional Filipino spirit of helping one another without expecting anything in return.

"Clara, can you help us paint the colorful lanzones paper-mache props?" asked her older brother, Kuya Jun.

"Yes, Kuya! I will mix the bright yellow and green colors," Clara answered happily.

As the afternoon went on, neighbors started coming to their front yard. Mang Pedro brought native snacks (suman and bibingka) for the workers. Aling Nena helped sew the children's leaf-patterned costumes. Everyone worked hand-in-hand, laughing and telling stories.

On the day of the festival, Clara's barangay performed beautifully. Their costumes were bright, and their props were stunning. But most of all, the judges saw the unity and joy in their movement. They won the grand prize!

That evening, as they shared a sweet bowl of lanzones, Clara's father said, "Our win is sweet, but our cooperation is sweeter. That is the true spirit of Bayanihan."

**Think and Discuss:**
1. What festival is Clara's family celebrating?
2. What does "Bayanihan" mean?
3. How did the neighbors show the spirit of Bayanihan during the preparation?
4. How do you practice cooperation in your own family or school?`
  }
];

const matatagLessons = rawMatatagLessons.map(lesson => {
  const match = (lesson.title || '').match(/(\d+)/);
  const order = match ? parseInt(match[1], 10) : 1;
  return {
    ...lesson,
    order,
    contentText: lesson.contentText ? lesson.contentText.replace(/\*/g, '') : ''
  };
});

export default AdminLessons;
