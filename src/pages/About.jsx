import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function About() {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    role: 'Student',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const teamMembers = [
    { 
      name: "Ashley Margaux A. Solis", 
      role: "Project Manager", 
      cont: "Managing the team" 
    },
    { 
      name: "Danica Joie R. Allauigan", 
      role: "Data Analyst", 
      cont: "Budgeting for the costs of making the game and other expenses" 
    },
    { 
      name: "Christian Joseph G. Doronio", 
      role: "Document Specialist", 
      cont: "Formatting of the manuscript and other documents" 
    },
    { 
      name: "Van Ryan M. Navarez", 
      role: "Programmer (Website)", 
      cont: "Developing the whole website" 
    },
    { 
      name: "Carlos Miguel A. Agila", 
      role: "Programmer (Game)", 
      cont: "Developing the whole game" 
    },
    { 
      name: "Derille P. Pagayon", 
      role: "3D Artist", 
      cont: "Modeling of the characters and environment" 
    }
  ];

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#fff' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.5rem', color: '#e0c3fc', marginBottom: '10px', fontWeight: '400' }}>
          About Dream Pixels
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8c97c', fontSize: '1.1rem' }}>
          Team Description
        </p>
      </div>
      
      {/* Team List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {teamMembers.map((member, index) => (
          <div key={index} className="responsive-flex-row" style={{ gap: '30px' }}>
            
            {/* Profile Avatar Placeholder */}
            <div style={{ 
              width: '120px', 
              height: '120px', 
              backgroundColor: '#e6e6e6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              {/* Default icon using FontAwesome */}
              <i className="fa-solid fa-user" style={{ fontSize: '4rem', color: '#a0a0a0', marginTop: '20px' }}></i>
            </div>

            {/* Member Details */}
            <div style={{ flex: '1', maxWidth: '400px', fontFamily: 'Montserrat, sans-serif', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#e0c3fc', marginBottom: '5px', fontWeight: '700' }}>
                {member.name}
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                <span style={{ color: '#e8c97c', fontWeight: '600' }}>Role:</span> {member.role}
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                <span style={{ color: '#e8c97c', fontWeight: '600' }}>Contribution:</span> {member.cont}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* Contact Section */}
      <hr style={{ border: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '60px 0' }} />
      
      <div id="contact" style={{ scrollMarginTop: '100px' }}>
        <h2 style={{ fontFamily: 'Berkshire Swash, cursive', fontSize: '2.5rem', color: '#e0c3fc', marginBottom: '10px', textAlign: 'center', fontWeight: '400' }}>
          Contact Us
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#e8c97c', fontSize: '1.1rem', textAlign: 'center', marginBottom: '40px' }}>
          Have any questions or feedback? Send us a message!
        </p>

        <div className="responsive-flex-row" style={{ gap: '40px', alignItems: 'stretch' }}>
          {/* Contact Details & Socials Column */}
          <div style={{ flex: '1', minWidth: '280px', fontFamily: 'Montserrat, sans-serif', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#e0c3fc', marginBottom: '20px', fontWeight: '700' }}>
                Get In Touch
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <i className="fa-solid fa-envelope" style={{ fontSize: '1.2rem', color: '#e8c97c', marginTop: '4px' }}></i>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>Email Address</h4>
                  <a href="mailto:support.dreampixels@gmail.com" style={{ fontSize: '0.9rem', color: '#e0c3fc', textDecoration: 'none' }}>
                    support.dreampixels@gmail.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <i className="fa-solid fa-location-dot" style={{ fontSize: '1.2rem', color: '#e8c97c', marginTop: '4px' }}></i>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>Our Studio</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc', lineHeight: '1.4' }}>
                    Dream Pixels Studio, Manila, Philippines
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div id="social" style={{ scrollMarginTop: '100px', marginTop: '30px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#e8c97c', marginBottom: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Follow Us
              </h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#3b5998', borderRadius: '50%', color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#1da1f2', borderRadius: '50%', color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#ff0000', borderRadius: '50%', color: '#fff', fontSize: '1.1rem', textDecoration: 'none', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div style={{ flex: '1.2', minWidth: '300px', backgroundColor: '#4a3b5a', borderRadius: '15px', padding: '30px', border: '1px solid #d1a7d1', boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}>
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
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}
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
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}
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
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem' }}
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
                  style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#333', fontFamily: 'Montserrat, sans-serif', fontSize: '0.95rem', lineHeight: '1.5' }}
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

    </div>
  );
}

export default About;
