import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchAnime } from "../services/animeService";
import { useSearch } from "../hooks/useSearch";
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

// Anime Card Component
function AnimeCard({ anime }) {
  const img = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || "";
  
  return (
    <Link to={`/anime/${anime.mal_id}`} className={styles.animeCard}>
      <div className={styles.animeCardImage}>
        {img && <img src={img} alt={anime.title} loading="lazy" />}
        {anime.score && (
          <div className={styles.animeCardScore}>
            <span>★</span> {anime.score}
          </div>
        )}
        <div className={styles.animeCardOverlay}>
          <span>View Details</span>
        </div>
      </div>
      <div className={styles.animeCardInfo}>
        <h3 className={styles.animeCardTitle}>{anime.title}</h3>
        <div className={styles.animeCardMeta}>
          {anime.type && <span>{anime.type}</span>}
          {anime.episodes && <span>• {anime.episodes} eps</span>}
          {anime.year && <span>• {anime.year}</span>}
        </div>
      </div>
    </Link>
  );
}

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

  // Sync input with query from context
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
      setError("Failed to fetch anime. Please try again.");
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
      setError("Failed to fetch anime. Please try again.");
    } finally {
      setLoading(false);
    }
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
              />
              <button 
                type="submit" 
                className={styles.heroSearchButton}
                disabled={loading}
              >
                {loading ? "Searching..." : "🔍 Search"}
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

      {/* ============ SEARCH RESULTS SECTION ============ */}
      {(loading || error || results.length > 0 || (hasSearched && results.length === 0)) && (
        <section className={styles.resultsSection}>
          <div className={styles.sectionContainer}>
            {/* Loading State */}
            {loading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <p className={styles.loadingText}>Searching for amazing anime...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className={styles.errorMessage}>
                <p>⚠️ {error}</p>
              </div>
            )}
            
            {/* Results */}
            {!loading && !error && results.length > 0 && (
              <>
                <div className={styles.resultsHeader}>
                  <h2 className={styles.resultsTitle}>
                    Results for "{query}"
                    <span className={styles.resultsCount}>{results.length} found</span>
                  </h2>
                </div>
                
                <div className={styles.resultsGrid}>
                  {results.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              </>
            )}
            
            {/* No Results */}
            {!loading && !error && hasSearched && results.length === 0 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <p className={styles.noResultsText}>No anime found for "{query}"</p>
                <p className={styles.noResultsHint}>
                  Try searching for popular titles like "Naruto", "One Piece", or "Attack on Titan"
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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
