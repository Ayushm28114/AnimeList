import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

// Categories data
const CATEGORIES = [
  { id: "action", name: "Action", icon: "⚔️", color: "#ef4444" },
  { id: "romance", name: "Romance", icon: "💕", color: "#ec4899" },
  { id: "comedy", name: "Comedy", icon: "😄", color: "#fbbf24" },
  { id: "adventure", name: "Adventure", icon: "🌍", color: "#22c55e" },
  { id: "fantasy", name: "Fantasy", icon: "🔮", color: "#8b5cf6" },
  { id: "sci-fi", name: "Sci-Fi", icon: "🚀", color: "#06b6d4" },
  { id: "drama", name: "Drama", icon: "🎭", color: "#f97316" },
  { id: "horror", name: "Horror", icon: "👻", color: "#6366f1" },
];

// Features data
const FEATURES = [
  {
    icon: "🔍",
    title: "Smart Search",
    description: "Find any anime instantly with our powerful search engine powered by Jikan API"
  },
  {
    icon: "📊",
    title: "Detailed Info",
    description: "Get comprehensive details, ratings, episodes, and streaming information"
  },
  {
    icon: "❤️",
    title: "Watchlist",
    description: "Save your favorite anime to your personal watchlist for later viewing"
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  // Navigate to search page
  const handleSearch = (e) => {
    e && e.preventDefault();
    if (!inputValue.trim()) return;
    navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  // Navigate to search page with category
  const handleCategoryClick = (category) => {
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  // When user focuses the hero search input on the home page, redirect them to the search page so they can type there.
  const handleFocusSearch = () => {
    const q = inputValue.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div className={styles.pageContainer}>
      {/* ============ HERO SECTION ============ */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} />
        
        <div className={styles.heroContent}>
          {/* Tagline */}
          <div className={styles.heroTagline}>
            ✨ <span>Premium</span> Anime Discovery Platform
          </div>
          
          {/* Title */}
          <h1 className={styles.heroTitle}>
            Discover Your Next{" "}
            <span className={styles.heroTitleGradient}>Favorite Anime</span>
          </h1>
          
          {/* Subtitle */}
          <p className={styles.heroSubtitle}>
            Explore thousands of anime series, get detailed information, 
            ratings, and build your personal watchlist. Your ultimate 
            anime companion awaits.
          </p>
          
          {/* Search Form */}
          <div className={styles.heroSearchContainer}>
            <form className={styles.heroSearchForm} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.heroSearchInput}
                placeholder="Search for anime... (e.g., Naruto, One Piece)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleFocusSearch}
              />
              <button 
                type="submit" 
                className={styles.heroSearchButton}
              >
                🔍 Search
              </button>
            </form>
          </div>
          
          {/* Stats */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>25,000+</span>
              <span className={styles.heroStatLabel}>Anime Titles</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>∞</span>
              <span className={styles.heroStatLabel}>Adventures</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>24/7</span>
              <span className={styles.heroStatLabel}>Discovery</span>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <span>↓</span>
          Scroll to explore
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <div className={styles.sectionIcon}>🎭</div>
              <div>
                <h2 className={styles.sectionTitle}>Browse by Genre</h2>
                <p className={styles.sectionSubtitle}>Find anime by your favorite category</p>
              </div>
            </div>
          </div>
          
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={styles.categoryChip}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryName}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <div className={styles.sectionIcon}>⚡</div>
              <div>
                <h2 className={styles.sectionTitle}>Why AnimeVerse?</h2>
                <p className={styles.sectionSubtitle}>Your complete anime discovery toolkit</p>
              </div>
            </div>
          </div>
          
          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
