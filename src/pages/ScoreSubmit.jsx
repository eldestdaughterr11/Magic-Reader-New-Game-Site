import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

function ScoreSubmit() {
  const [userProfile, setUserProfile] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [inputScore, setInputScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'no-change' | 'error'
  const [loading, setLoading] = useState(true);

  // Achievement levels
  const getAchievement = (score) => {
    const s = score || 0;
    if (s >= 5000) return { title: 'Word Master', color: '#FFD700', icon: '👑' };
    if (s >= 4000) return { title: 'Fast Solver', color: '#C0C0C0', icon: '⚡' };
    if (s >= 3000) return { title: 'Minigames Fanatic', color: '#CD7F32', icon: '🎮' };
    if (s >= 2000) return { title: 'Grammar Wizard', color: '#e0c3fc', icon: '🔮' };
    if (s >= 1000) return { title: 'Spelling Bee', color: '#e8c97c', icon: '🐝' };
    return { title: 'Beginner Reader', color: '#aaa', icon: '📖' };
  };

  // Fetch current user profile and score from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile(data);
            setCurrentScore(data.score || 0);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    const newScore = parseInt(inputScore, 10);

    if (isNaN(newScore) || newScore < 0) {
      alert('Please enter a valid score!');
      return;
    }

    // Only update if the new score is HIGHER than the current high score
    if (newScore <= currentScore) {
      setSubmitStatus('no-change');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);

      // Update the user's score in Firestore
      await updateDoc(userRef, {
        score: newScore,
        lastScoreUpdated: new Date().toISOString()
      });

      // Log activity
      await addDoc(collection(db, 'activities'), {
        action: `Submitted New High Score: ${newScore}`,
        user: userProfile?.name || user.email,
        timestamp: new Date().toISOString()
      });

      setCurrentScore(newScore);
      setInputScore('');
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 6000);
    } catch (err) {
      console.error('Error submitting score:', err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: '#fff', padding: '100px 20px', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  const achievement = getAchievement(currentScore);
  const nextAchievement = getAchievement(currentScore + 1);
  const thresholds = [0, 1000, 2000, 3000, 4000, 5000];
  const nextThreshold = thresholds.find(t => t > currentScore) || 5000;
  const progressPct = Math.min((currentScore / nextThreshold) * 100, 100);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 20px', color: '#fff' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{
          fontFamily: 'Berkshire Swash, cursive',
          fontSize: '2.8rem',
          color: '#e0c3fc',
          marginBottom: '10px',
          fontWeight: '400'
        }}>
          Submit Your Score
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8c97c', fontSize: '1.05rem' }}>
          Played The Sound Keeper? Enter your score to get ranked on the Leaderboard!
        </p>
      </div>

      {/* Current Score Card */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.12)',
        marginBottom: '35px',
        textAlign: 'center'
      }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
          Your Current High Score
        </p>
        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#e8c97c', fontFamily: 'Montserrat, sans-serif', lineHeight: '1', marginBottom: '12px' }}>
          {currentScore.toLocaleString()}
        </div>

        {/* Achievement Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '25px',
          padding: '8px 20px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{achievement.icon}</span>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.95rem', color: achievement.color }}>
            {achievement.title}
          </span>
        </div>

        {/* Progress bar to next level */}
        {currentScore < 5000 && (
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
              {nextThreshold - currentScore} pts to reach <strong style={{ color: getAchievement(nextThreshold).color }}>{getAchievement(nextThreshold).title}</strong>
            </p>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                backgroundColor: '#e8c97c',
                borderRadius: '10px',
                transition: 'width 0.8s ease'
              }} />
            </div>
          </div>
        )}
        {currentScore >= 5000 && (
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: '#FFD700' }}>
            🏆 Maximum rank achieved! You are a Word Master!
          </p>
        )}
      </div>

      {/* How to Submit */}
      <div style={{
        backgroundColor: 'rgba(232,201,124,0.08)',
        borderRadius: '15px',
        padding: '20px 25px',
        border: '1px solid rgba(232,201,124,0.2)',
        marginBottom: '30px'
      }}>
        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: '#e8c97c', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          📋 How to Submit Your Score
        </h4>
        <ol style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.9', paddingLeft: '18px', margin: 0 }}>
          <li>Download and play <strong style={{ color: '#e0c3fc' }}>The Sound Keeper</strong></li>
          <li>Finish the game or reach your highest score</li>
          <li>Check your final score on the game's end screen</li>
          <li>Enter it below — <strong style={{ color: '#e8c97c' }}>only higher scores will be saved!</strong></li>
        </ol>
      </div>

      {/* Score Submission Form */}
      <div style={{
        backgroundColor: '#4a3b5a',
        borderRadius: '20px',
        padding: '35px',
        border: '1px solid #d1a7d1',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}>
        <form onSubmit={handleSubmitScore}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: '#e8c97c',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Your New Score
            </label>
            <input
              type="number"
              min="1"
              placeholder={`Enter score higher than ${currentScore.toLocaleString()}...`}
              value={inputScore}
              onChange={e => setInputScore(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 18px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.3rem',
                fontWeight: '700',
                boxSizing: 'border-box',
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '2px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: isSubmitting ? '#888' : '#d4854a',
              color: '#fff',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              boxShadow: '0 4px 15px rgba(212, 133, 74, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#c5743b'; }}
            onMouseOut={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#d4854a'; }}
          >
            {isSubmitting ? (
              <>⏳ Saving score...</>
            ) : (
              <>🏆 Submit to Leaderboard</>
            )}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.95rem',
              color: '#4ade80'
            }}>
              🎉 <strong>New high score saved!</strong> Check the Leaderboard to see your rank!
            </div>
          )}
          {submitStatus === 'no-change' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 'rgba(232, 201, 124, 0.1)',
              border: '1px solid rgba(232, 201, 124, 0.3)',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              color: '#e8c97c'
            }}>
              ⚠️ Your current high score is already <strong>{currentScore.toLocaleString()}</strong>. Only scores higher than this will be saved!
            </div>
          )}
          {submitStatus === 'error' && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.9rem',
              color: '#f87171'
            }}>
              ❌ Failed to save score. Please try again.
            </div>
          )}
        </form>
      </div>

      {/* Achievement Reference Table */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '1.6rem', color: '#e0c3fc', marginBottom: '20px', textAlign: 'center', fontWeight: '400' }}>
          Achievement Ranks
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { min: 0, max: 999, ...getAchievement(0) },
            { min: 1000, max: 1999, ...getAchievement(1000) },
            { min: 2000, max: 2999, ...getAchievement(2000) },
            { min: 3000, max: 3999, ...getAchievement(3000) },
            { min: 4000, max: 4999, ...getAchievement(4000) },
            { min: 5000, max: null, ...getAchievement(5000) },
          ].map((rank) => (
            <div key={rank.title} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '14px 20px',
              backgroundColor: currentScore >= rank.min && (rank.max === null || currentScore <= rank.max)
                ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: currentScore >= rank.min && (rank.max === null || currentScore <= rank.max)
                ? `1px solid ${rank.color}44` : '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: '1.4rem', minWidth: '30px', textAlign: 'center' }}>{rank.icon}</span>
              <div style={{ flex: 1, fontFamily: 'Montserrat, sans-serif' }}>
                <span style={{ fontWeight: '700', color: rank.color, fontSize: '0.95rem' }}>{rank.title}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Montserrat, sans-serif' }}>
                {rank.max === null ? `${rank.min.toLocaleString()}+` : `${rank.min.toLocaleString()} – ${rank.max.toLocaleString()}`} pts
              </span>
              {currentScore >= rank.min && (rank.max === null || currentScore <= rank.max) && (
                <span style={{ fontSize: '0.75rem', backgroundColor: rank.color, color: '#000', borderRadius: '10px', padding: '3px 10px', fontWeight: 'bold' }}>
                  YOU
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ScoreSubmit;
