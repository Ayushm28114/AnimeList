import React from 'react'
import './style.css'

export default function AboutUs() {
  return (
    <div id="about_us_container">
      <h1 id="about_us_title">About AnimeVerse</h1>
      <p id="about_us_description">Your ultimate destination for discovering amazing anime!</p>

      <div className="about-content">
        <section className="about-section">
          <h2>🎯 Our Mission</h2>
          <p id="our_mission">
            We are passionate anime fans dedicated to bringing you the best anime experience. 
            Our platform offers comprehensive information about your favorite anime series, 
            from classics to the latest releases. We believe every otaku deserves a beautiful, 
            fast, and reliable way to explore the world of anime.
          </p>
        </section>
        
        <section className="about-section">
          <h2>✨ What We Offer</h2>
          <div id="uol">
            <ul>
              <li>📺 Extensive anime database</li>
              <li>⭐ User reviews & ratings</li>
              <li>🔥 Trending recommendations</li>
              <li>📅 Release schedules</li>
              <li>🎭 Character details</li>
              <li>🎬 Trailers & media</li>
            </ul>
          </div>
        </section>
        
        <section className="about-section">
          <h2>👨‍💻 About the Developer</h2>
          <p id="about_developer">
            Hi! I'm a passionate anime enthusiast and web developer who created AnimeVerse 
            to share my love for anime with fellow otakus around the world. This project 
            combines modern web technologies with a deep appreciation for anime culture. 
            Join us in discovering amazing series and building a community of anime lovers!
          </p>
        </section>

        <section className="about-section">
          <h2>💫 Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>🎌 Authentic</h3>
              <p>Curated by true fans</p>
            </div>
            <div className="feature-item">
              <h3>⚡ Fast</h3>
              <p>Lightning-quick updates</p>
            </div>
            <div className="feature-item">
              <h3>🌟 Quality</h3>
              <p>Detailed reviews</p>
            </div>
            <div className="feature-item">
              <h3>👥 Community</h3>
              <p>Connect with otakus</p>
            </div>
            <div className="feature-item">
              <h3>🎯 Personal</h3>
              <p>Tailored for you</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
