import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import './style.css'
import logo from '../assets/logo.png'


const Navbar = ({isAuthenticated, user, logout}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    const animationPlayed = sessionStorage.getItem('logoAnimationPlayed');
    if (animationPlayed) {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem('logoAnimationPlayed', 'true');
    }
  }, []);
  
  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Motion.img
            initial={hasAnimated ? false : {
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0
            }}
            animate={hasAnimated ? {} : {              
              x: [0, 350, 0],
              y:[0, 150, 0],
              scale:[1, 4, 1],
              rotate: [0, 360, -360],
            }}
            transition={hasAnimated ? {} : {
              duration: 8,
              times: [0, 0.5, 1],
              delay: 1,
              ease: "backInOut"
            }}
            className="navbar-logo" 
            src={logo} 
            alt="AnimeVerse Logo" 
          />
          <Link className="brand-text" to="/">
            <span className="brand-main">Anime</span>
            <span className="brand-accent">Verse</span>
          </Link>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            <Link className="nav-link" to="/about">
              <span className="nav-icon">ℹ️</span>
              About
            </Link>
            <Link className="nav-link" to="/contact">
              <span className="nav-icon">📞</span>
              Contact
            </Link>
          </div>
          
          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">Hi, {user?.username || 'User'}</span>
                </div>
                <Link className="auth-link profile-link" to="/profile">
                  <span className="nav-icon">👤</span>
                  Profile
                </Link>
                <button className="auth-button logout-btn" onClick={logout}>
                  <span className="nav-icon">🚪</span>
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link className="auth-link login-link" to="/login">
                  <span className="nav-icon">🔑</span>
                  Login
                </Link>
                <Link className="auth-link register-link" to="/register">
                  <span className="nav-icon">📝</span>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;