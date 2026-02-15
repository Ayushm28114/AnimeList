import { useState, useEffect } from "react";
import { searchAnime } from "../services/animeService";
import { AnimeCardContainer } from "../Components/AnimeCard";
import { useSearch } from "../hooks/useSearch";
// import Posters from "../Components/Posters";
import "../Components/style.css";

export default function HomePage() {
  const { 
    query, 
    setQuery, 
    results, 
    setResults, 
    hasSearched, 
    setHasSearched 
  } = useSearch();
  
  const [inputValue, setInputValue] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync input with query from context when component mounts
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (!inputValue.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(inputValue);
    setHasSearched(true);
    try {
      const data = await searchAnime(inputValue);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch anime. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setInputValue(category);
    setQuery(category);
    setHasSearched(true);
    setLoading(true);
    setError(null);
    try {
      const data = await searchAnime(category);
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch anime. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">AnimeVerse</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing anime series, explore detailed information, and dive into the captivating world of Japanese animation.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Anime Series</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">∞</span>
                <span className="stat-label">Adventures</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Discovery</span>
              </div>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="floating-icons">
              <div className="icon-item">🎌</div>
              <div className="icon-item">⚡</div>
              <div className="icon-item">🌟</div>
              <div className="icon-item">🎭</div>
              <div className="icon-item">🗾</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Find any anime instantly with our powerful search engine</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Info</h3>
            <p>Get comprehensive details, ratings, and episode information</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Personalized</h3>
            <p>Discover anime tailored to your preferences and interests</p>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Popular Categories</h2>
        <div className="categories-grid">
          <div className="category-card" onClick={() => handleCategoryClick("action")}>
            <div className="category-icon">⚔️</div>
            <span>Action</span>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick("romance")}>
            <div className="category-icon">💕</div>
            <span>Romance</span>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick("comedy")}>
            <div className="category-icon">😄</div>
            <span>Comedy</span>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick("adventure")}>
            <div className="category-icon">🌍</div>
            <span>Adventure</span>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick("fantasy")}>
            <div className="category-icon">🔮</div>
            <span>Fantasy</span>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick("sci-fi")}>
            <div className="category-icon">🚀</div>
            <span>Sci-Fi</span>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <div className="search-section">
        <h1>🎌 Discover Your Next Favorite Anime</h1>
        <p className="search-description">
          Search through thousands of anime series and find your next binge-worthy adventure!
        </p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="Type anime title (e.g., Naruto, One Piece, Attack on Titan)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>

        {loading && <div className="loading-message">Searching for anime...⚡</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Search Results Section */}
      {results.length > 0 && (
        <AnimeCardContainer 
          animeList={results} 
          title={`Search Results for "${query}" (${results.length} found)`}
        />
      )}

      {/* No Results Message */}
      {hasSearched && results.length === 0 && !loading && (
        <div className="no-results">
          No anime found for "{query}". Try searching for popular titles like "Naruto" or "One Piece"! 🎌
        </div>
      )}
    </div>
  );
}
