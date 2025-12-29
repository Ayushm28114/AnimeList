import React, { Component } from 'react'
import './style.css'

export default class AboutUs extends Component {
  render() {
    return (
        <div id="about_us_container">
            <h1 id="about_us_title">About Grand-Line</h1>
            <p id="about_us_description">Welcome to Grand-Line - Your ultimate anime destination!</p>

            <div className="about-content">
            <section className="about-section">
                <h2>Our Mission</h2>
                <p id="our_mission">We are passionate anime fans dedicated to bringing you the best anime experience. <br /> Our platform offers comprehensive information about your favorite anime series, from classics to the latest releases.</p>
            </section>
            
            <section className="about-section">
                <h2>What We Offer</h2>
                <div id="uol">
                    <ul>
                    <li>📺 Extensive anime database with 1000+ series</li>
                    <li>⭐ User reviews and ratings</li>
                    <li>🔥 Trending and popular anime recommendations</li>
                    <li>📅 Release schedules and updates</li>
                    <li>🎭 Character information and details</li>
                    </ul>
                </div>
            </section>
            
            <section className="about-section">
                <h2>About the Developer</h2>
                <p id="about_developer">Hi! I'm a passionate anime enthusiast who created Grand-Line to share my love for anime with fellow otakus around the world. This project combines my skills in web development with my passion for anime culture. Join me in discovering amazing anime series and building a community of anime lovers!</p>
            </section>

            <section className="about-section">
                
                    <h2>Why Choose Grand-Line?</h2>
                    <div className="features-grid">
                    <div className="feature-item">
                        <h3>🎌 Authentic Content</h3>
                        <p>Curated by true anime fans</p>
                    </div>
                    <div className="feature-item">
                        <h3>⚡ Fast Updates</h3>
                        <p>Latest episodes and news</p>
                    </div>
                    <div className="feature-item">
                        <h3>🌟 Quality Reviews</h3>
                        <p>Honest and detailed reviews</p>
                    </div>
                    <div className="feature-item">
                        <h3>👥 Community</h3>
                        <p>Connect with fellow otakus</p>
                    </div>
                    <div className="feature-item">
                        <h3>🎯 Personalized</h3>
                        <p>Tailored recommendations</p>
                    </div>
                </div>
                
            </section>
            </div>
        </div>
    )
  }
}
