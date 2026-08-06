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
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      alert("Please fill out all fields!");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...contactData,
        createdAt: new Date().toISOString()
      });
      setContactData({ name: '', email: '', role: 'Student', message: '' });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      console.error("Error saving contact message: ", err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', color: '#fff' }}>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.8rem', color: '#e0c3fc', marginBottom: '10px', fontWeight: '400' }}>
          Contact Us
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8c97c', fontSize: '1.1rem' }}>
          Have any questions or feedback? Send us a message!
        </p>
      </div>

      <div className="responsive-flex-row-stretch contact-wrapper" style={{ gap: '30px' }}>

        {/* Left Info Column */}
        <div className="contact-left-col" style={{
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          textAlign: 'left'
        }}>

          {/* Get In Touch */}
          <h3 style={{ fontSize: '1.3rem', color: '#e0c3fc', marginBottom: '8px', fontWeight: '700' }}>
            Get In Touch
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px', lineHeight: '1.5' }}>
            We'd love to hear from you! Reach out anytime.
          </p>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: 'rgba(232,201,124,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <i className="fa-solid fa-envelope" style={{ fontSize: '1rem', color: '#e8c97c' }}></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</h4>
              <a href="mailto:dreampixels2026@gmail.com" style={{ fontSize: '0.88rem', color: '#e0c3fc', textDecoration: 'none', wordBreak: 'break-all' }}>
                dreampixels2026@gmail.com
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: 'rgba(224,195,252,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <i className="fa-solid fa-clock" style={{ fontSize: '1rem', color: '#e0c3fc' }}></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Response Time</h4>
              <span style={{ fontSize: '0.88rem', color: '#fff' }}>Usually within 1–2 days</span>
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '28px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              backgroundColor: 'rgba(212,133,74,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <i className="fa-solid fa-location-dot" style={{ fontSize: '1rem', color: '#d4854a' }}></i>
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Based In</h4>
              <span style={{ fontSize: '0.88rem', color: '#fff' }}>Philippines 🇵🇭</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '24px' }}></div>

          {/* Follow Us */}
          <h4 style={{ fontSize: '0.85rem', color: '#e8c97c', marginBottom: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Follow Us
          </h4>
          <a
            href="mailto:dreampixels2026@gmail.com"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#e0c3fc', fontSize: '0.88rem', textDecoration: 'none', marginBottom: '10px' }}
          >
            <i className="fa-solid fa-envelope" style={{ color: '#e8c97c', width: '16px' }}></i>
            dreampixels2026@gmail.com
          </a>



        </div>

        {/* Contact Form Column */}
        <div className="contact-right-col" style={{ backgroundColor: '#4a3b5a', borderRadius: '15px', padding: '30px', border: '1px solid #d1a7d1', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', textAlign: 'left' }}>
          <form onSubmit={handleContactSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#e8c97c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={contactData.name}
                onChange={e => setContactData({...contactData, name: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#e8c97c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={contactData.email}
                onChange={e => setContactData({...contactData, email: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#e8c97c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Who are you?
              </label>
              <select
                value={contactData.role}
                onChange={e => setContactData({...contactData, role: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', boxSizing: 'border-box' }}
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Teacher">Teacher</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '0.85rem', color: '#e8c97c', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Message
              </label>
              <textarea
                placeholder="How can we help you? Share your ideas or report a bug..."
                value={contactData.message}
                onChange={e => setContactData({...contactData, message: e.target.value})}
                style={{ width: '100%', minHeight: '140px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.5', resize: 'vertical', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '12px', borderRadius: '25px', border: 'none', backgroundColor: '#d4854a', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s', boxShadow: '0 4px 15px rgba(212, 133, 74, 0.3)' }}
              onMouseOver={e => { if(!isSubmitting) e.currentTarget.style.backgroundColor = '#c5743b' }}
              onMouseOut={e => { if(!isSubmitting) e.currentTarget.style.backgroundColor = '#d4854a' }}
            >
              {isSubmitting ? "Sending message..." : "Send Message"}
            </button>

            {submitStatus === 'success' && (
              <p style={{ color: '#4ade80', fontSize: '0.9rem', marginTop: '15px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
                ✨ Message sent successfully! Thank you.
              </p>
            )}
            {submitStatus === 'error' && (
              <p style={{ color: '#f87171', fontSize: '0.9rem', marginTop: '15px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
                ❌ Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;
