import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function Contact() {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    role: 'Student',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...contactData,
        submittedAt: new Date().toISOString()
      });
      setSubmitStatus('success');
      setContactData({ name: '', email: '', role: 'Student', message: '' });
    } catch (err) {
      console.error("Error submitting contact form: ", err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-bg page-bg--contact">
      <div style={{ maxWidth: '950px', margin: '0 auto', padding: '24px 20px 60px', color: '#fff', position: 'relative', zIndex: 2 }}>

        {/* Title Card */}
        <div className="gameplay-info-card" style={{ textAlign: 'center', marginBottom: '35px' }}>
          <span className="gameplay-badge" style={{ marginBottom: '10px' }}>
            <span className="gameplay-badge__letter">✦</span>
            <span>Get in Touch</span>
          </span>
          <h2 className="section-title" style={{ color: '#d4854a', fontSize: '2.4rem', marginBottom: '8px', textShadow: '0 0 20px rgba(212, 133, 74, 0.45)' }}>
            Contact Us
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.02rem', maxWidth: '620px', margin: '0 auto' }}>
            Have questions about the game, feedback on phonics lessons, or want to partner with us? We'd love to hear from you.
          </p>
        </div>

        <div className="responsive-flex-row-stretch contact-wrapper" style={{ gap: '28px' }}>

          {/* Left Info Column */}
          <div className="contact-left-col gameplay-card" style={{
            fontFamily: 'Montserrat, sans-serif',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
          }}>

            {/* Get In Touch */}
            <h3 style={{ fontSize: '1.4rem', color: '#f4c975', marginBottom: '8px', fontWeight: '700', fontFamily: 'Berkshire Swash, cursive' }}>
              Connect With Us
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.6' }}>
              Reach out directly or send an email. We actively respond to students, teachers, and parents.
            </p>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: 'rgba(212,133,74,0.18)',
                border: '1px solid rgba(212,133,74,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <i className="fa-solid fa-envelope" style={{ fontSize: '1.1rem', color: '#f4c975' }}></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</h4>
                <a href="mailto:dreampixels2026@gmail.com" style={{ fontSize: '0.9rem', color: '#e0c3fc', textDecoration: 'none', wordBreak: 'break-all', fontWeight: '600' }}>
                  dreampixels2026@gmail.com
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: 'rgba(224,195,252,0.15)',
                border: '1px solid rgba(224,195,252,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <i className="fa-solid fa-clock" style={{ fontSize: '1.1rem', color: '#e0c3fc' }}></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response Time</h4>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>Usually within 1–2 days</span>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '28px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: 'rgba(0,220,200,0.12)',
                border: '1px solid rgba(0,220,200,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <i className="fa-solid fa-location-dot" style={{ fontSize: '1.1rem', color: '#00d2ff' }}></i>
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Based In</h4>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>Philippines 🇵🇭</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

            {/* Direct Link */}
            <h4 style={{ fontSize: '0.82rem', color: '#e8c97c', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Contact
            </h4>
            <a
              href="mailto:dreampixels2026@gmail.com"
              className="footer-email-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'fit-content' }}
            >
              <i className="fa-solid fa-paper-plane" style={{ color: '#d4854a' }}></i>
              Send Direct Email
            </a>

          </div>

          {/* Contact Form Column */}
          <div className="contact-right-col gameplay-info-card" style={{ padding: '32px 30px', textAlign: 'left', margin: 0 }}>
            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#f4c975', letterSpacing: '0.05em' }}>
                  YOUR NAME
                </label>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={contactData.name}
                  onChange={e => setContactData({...contactData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(224, 195, 252, 0.25)', backgroundColor: 'rgba(14, 8, 22, 0.7)', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#f4c975', letterSpacing: '0.05em' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={contactData.email}
                  onChange={e => setContactData({...contactData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(224, 195, 252, 0.25)', backgroundColor: 'rgba(14, 8, 22, 0.7)', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#f4c975', letterSpacing: '0.05em' }}>
                  WHO ARE YOU?
                </label>
                <select
                  value={contactData.role}
                  onChange={e => setContactData({...contactData, role: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(224, 195, 252, 0.25)', backgroundColor: 'rgba(14, 8, 22, 0.7)', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
                >
                  <option value="Student" style={{ background: '#2a1a3d', color: '#fff' }}>Student</option>
                  <option value="Parent" style={{ background: '#2a1a3d', color: '#fff' }}>Parent</option>
                  <option value="Teacher" style={{ background: '#2a1a3d', color: '#fff' }}>Teacher</option>
                  <option value="Other" style={{ background: '#2a1a3d', color: '#fff' }}>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#f4c975', letterSpacing: '0.05em' }}>
                  MESSAGE
                </label>
                <textarea
                  placeholder="How can we help you? Share your ideas, questions, or report an issue..."
                  value={contactData.message}
                  onChange={e => setContactData({...contactData, message: e.target.value})}
                  style={{ width: '100%', minHeight: '140px', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(224, 195, 252, 0.25)', backgroundColor: 'rgba(14, 8, 22, 0.7)', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.6', resize: 'vertical', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '30px', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  background: 'linear-gradient(135deg, #d4854a 0%, #b86230 100%)', 
                  color: '#fff', 
                  fontFamily: 'Montserrat, sans-serif', 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                  boxShadow: '0 6px 20px rgba(212, 133, 74, 0.45)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? (
                  <span><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Sending message...</span>
                ) : (
                  <span><i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>Send Message</span>
                )}
              </button>

              {submitStatus === 'success' && (
                <div style={{ background: 'rgba(74, 222, 128, 0.15)', border: '1px solid #4ade80', borderRadius: '10px', padding: '12px', marginTop: '16px', textAlign: 'center', color: '#4ade80', fontFamily: 'Montserrat, sans-serif', fontSize: '0.92rem', fontWeight: '600' }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
                  Message sent successfully! Thank you.
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ background: 'rgba(248, 113, 113, 0.15)', border: '1px solid #f87171', borderRadius: '10px', padding: '12px', marginTop: '16px', textAlign: 'center', color: '#f87171', fontFamily: 'Montserrat, sans-serif', fontSize: '0.92rem', fontWeight: '600' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
                  Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
