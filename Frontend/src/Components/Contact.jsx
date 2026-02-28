import React, { useState } from 'react'
import './style.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'mail' ? 'email' : id === 'msg' ? 'message' : id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    
    // Clear status after 3 seconds
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  return (
    <div id="contact-page">
      <div id="form">
        <div id="contact-box">
          <h1 id="contact-title">Get In Touch</h1>
          <p style={{ color: '#b0b0b0', marginTop: '1.5rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            Have a question or want to work together? Drop us a message!
          </p>
        </div>
        <div id="contact-info">
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              id="name" 
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              type="email" 
              id="mail" 
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea 
              id="msg" 
              placeholder="Your Message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button 
              id="submit" 
              type="submit" 
              disabled={isSubmitting}
              style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <p style={{ 
                color: '#64ffda', 
                textAlign: 'center', 
                marginTop: '1rem',
                fontSize: '0.9rem'
              }}>
                ✓ Message sent successfully!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
