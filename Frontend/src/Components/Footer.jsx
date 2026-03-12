import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section">
          <div className="footer-brand">
            <span className="footer-brand-main">Anime</span>
            <span className="footer-brand-accent">Verse</span>
          </div>
          <p>Your ultimate destination for discovering and exploring the vast world of anime.</p>
          <div className="footer-social">
            <span className="footer-social-link" title="Twitter">🐦</span>
            <span className="footer-social-link" title="Discord">💬</span>
            <span className="footer-social-link" title="GitHub">💻</span>
            <span className="footer-social-link" title="Instagram">📷</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4>Top Genres</h4>
          <p>Action & Adventure</p>
          <p>Romance & Drama</p>
          <p>Comedy & Slice of Life</p>
          <p>Fantasy & Isekai</p>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Get in Touch</h4>
          <p>📧 support@animeverse.com</p>
          <p>🌍 Available Worldwide</p>
          <p>⏰ 24/7 Anime Discovery</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 AnimeVerse. Made with ❤️ by Ayush</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">FAQ</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
