import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion as Motion } from 'motion/react'
import { getSearchSuggestions } from '../services/animeService'
import './style.css'
import logo from '../assets/logo.png'


const Navbar = ({isAuthenticated, user, logout}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const animationPlayed = sessionStorage.getItem('logoAnimationPlayed');
    if (animationPlayed) {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem('logoAnimationPlayed', 'true');
    }
  }, []);

  // Clear search input when navigating to search page
  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location.pathname]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const data = await getSearchSuggestions(query);
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (err) {
      console.error('Suggestions error:', err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedIndex(-1);

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    setSearchInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchInput('');
    navigate(`/anime/${suggestion.mal_id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Don't show search bar on homepage (it has its own)
  const showNavSearch = location.pathname !== '/';
  
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

          {/* Compact Search Bar with Suggestions - Only show when not on homepage */}
          {showNavSearch && (
            <div className="navbar-search-wrapper" ref={searchRef}>
              <form className="navbar-search" onSubmit={handleNavSearch}>
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Search anime..."
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                />
                <button 
                  type="submit" 
                  className="navbar-search-btn"
                  disabled={!searchInput.trim()}
                >
                  {isLoadingSuggestions ? '...' : '🔍'}
                </button>
              </form>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="search-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.mal_id}
                      className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <img 
                        src={suggestion.image} 
                        alt={suggestion.title}
                        className="suggestion-image"
                      />
                      <div className="suggestion-info">
                        <span className="suggestion-title">{suggestion.title}</span>
                        <span className="suggestion-meta">
                          {suggestion.type}{suggestion.year ? ` • ${suggestion.year}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="suggestion-footer"
                    onClick={handleNavSearch}
                  >
                    Search for "{searchInput}" →
                  </div>
                </div>
              )}
            </div>
          )}
          
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