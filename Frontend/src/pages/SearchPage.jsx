import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchAnime } from "../services/animeService";
import { AnimeCardContainer } from "../Components/AnimeCard";
import SectionLoader from "../Components/SectionLoader";
import SectionError from "../Components/SectionError";
import "./SearchPage.css";

// Filter options
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "ona", label: "ONA" },
  { value: "special", label: "Special" },
  { value: "music", label: "Music" },
];
const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "airing", label: "Currently Airing" },
  { value: "complete", label: "Finished Airing" },
  { value: "upcoming", label: "Not Yet Aired" },
];
const RATING_OPTIONS = [
  { value: "", label: "All Ratings" },
  { value: "g", label: "G - All Ages" },
  { value: "pg", label: "PG - Children" },
  { value: "pg13", label: "PG-13 - Teens 13+" },
  { value: "r17", label: "R - 17+" },
];
const ORDER_OPTIONS = [
  { value: "", label: "Default" },
  { value: "score", label: "Score" },
  { value: "popularity", label: "Popularity" },
  { value: "title", label: "Title" },
  { value: "start_date", label: "Start Date" },
  { value: "episodes", label: "Episodes" },
  { value: "favorites", label: "Favorites" },
];

// Load saved preferences from localStorage
const loadSavedPreferences = () => {
  try {
    const saved = localStorage.getItem("animeSearchPreferences");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ 
    current: 1, 
    lastPage: 1, 
    hasNext: false,
    totalResults: 0,
    perPage: 24
  });

  // Advanced filter state
  const savedPrefs = loadSavedPreferences();
  const [filters, setFilters] = useState({
    minScore: savedPrefs?.minScore || "",
    type: savedPrefs?.type || "",
    status: savedPrefs?.status || "",
    rating: savedPrefs?.rating || "",
    startYear: savedPrefs?.startYear || "",
    orderBy: savedPrefs?.orderBy || "",
    sort: savedPrefs?.sort || "desc",
  });

  // Sync input with URL query
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const fetchResults = useCallback(async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await searchAnime(searchQuery, { ...filters, page });
      const data = response.data || [];
      const paginationData = response.pagination || {};
      
      setResults(data);
      setPagination({
        current: paginationData.current_page || 1,
        lastPage: paginationData.last_visible_page || 1,
        hasNext: paginationData.has_next_page || false,
        totalResults: paginationData.items?.total || data.length,
        perPage: paginationData.items?.per_page || 25,
      });
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);

  const handleRetry = () => {
    fetchResults(query);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchParams({ q: inputValue.trim() });
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSearchParams({ q: suggestion });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    if (query) {
      fetchResults(query);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      minScore: "",
      type: "",
      status: "",
      rating: "",
      startYear: "",
      orderBy: "",
      sort: "desc",
    });
  };

  // Save preferences
  const handleSavePreferences = () => {
    localStorage.setItem("animeSearchPreferences", JSON.stringify(filters));
    alert("Search preferences saved!");
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchResults(query, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-page">
      <div className="search-page-header">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
        
        <h1 className="search-page-title">
          {query ? (
            <>
              Results for "<span className="search-query">{query}</span>"
            </>
          ) : (
            "Search Anime"
          )}
        </h1>

        {/* Search Bar */}
        <form className="search-page-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-page-input"
              placeholder="Search for anime titles..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            {inputValue && (
              <button 
                type="button" 
                className="clear-btn"
                onClick={() => setInputValue('')}
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-page-btn" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Advanced Filters Toggle */}
        <button 
          className={`filters-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙️ Advanced Filters {showFilters ? '▲' : '▼'}
        </button>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filters-grid">
              {/* Min Score */}
              <div className="filter-group">
                <label>Min Score</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  placeholder="1-10"
                  value={filters.minScore}
                  onChange={(e) => handleFilterChange('minScore', e.target.value)}
                />
              </div>

              {/* Type */}
              <div className="filter-group">
                <label>Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="filter-group">
                <label>Status</label>
                <select 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="filter-group">
                <label>Rating</label>
                <select 
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  {RATING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Start Year */}
              <div className="filter-group">
                <label>Year</label>
                <select 
                  value={filters.startYear}
                  onChange={(e) => handleFilterChange('startYear', e.target.value)}
                >
                  <option value="">All Years</option>
                  {YEAR_OPTIONS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Order By */}
              <div className="filter-group">
                <label>Order By</label>
                <select 
                  value={filters.orderBy}
                  onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                >
                  {ORDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Direction */}
              <div className="filter-group">
                <label>Sort</label>
                <select 
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="filters-actions">
              <button className="filter-btn apply" onClick={handleApplyFilters}>
                🔍 Apply Filters
              </button>
              <button className="filter-btn reset" onClick={handleResetFilters}>
                🔄 Reset
              </button>
              <button className="filter-btn save" onClick={handleSavePreferences}>
                💾 Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestions */}
        <div className="quick-suggestions">
          <span>Popular:</span>
          {["Naruto", "One Piece", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"].map((item) => (
            <button
              key={item}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {hasSearched && !loading && !error && (
          <p className="results-count">
            {pagination.totalResults > 0 ? (
              <>
                Found <strong>{pagination.totalResults}</strong> result{pagination.totalResults !== 1 ? "s" : ""} 
                {pagination.lastPage > 1 && (
                  <> • Showing {((pagination.current - 1) * pagination.perPage) + 1}-{Math.min(pagination.current * pagination.perPage, pagination.totalResults)} (Page {pagination.current} of {pagination.lastPage})</>
                )}
              </>
            ) : (
              <>Found {results.length} result{results.length !== 1 ? "s" : ""}</>
            )}
          </p>
        )}
      </div>

      <div className="search-page-content">
        {!query && !hasSearched && (
          <div className="no-query">
            <div className="no-query-icon">🎌</div>
            <h2>Discover Amazing Anime</h2>
            <p>Search for your favorite anime titles using the search bar above!</p>
          </div>
        )}

        {loading && (
          <div className="search-loading">
            <SectionLoader message={`Searching for "${query}"...`} />
          </div>
        )}

        {error && !loading && (
          <div className="search-error">
            <SectionError message={error} onRetry={handleRetry} />
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <AnimeCardContainer 
              animeList={results} 
              title=""
            />
            
            {/* Pagination */}
            {pagination.lastPage > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={pagination.current === 1}
                  onClick={() => handlePageChange(1)}
                  title="First page"
                >
                  ⏮ First
                </button>
                <button 
                  className="pagination-btn"
                  disabled={pagination.current === 1}
                  onClick={() => handlePageChange(pagination.current - 1)}
                >
                  ← Prev
                </button>
                
                {/* Page numbers */}
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                    let pageNum;
                    if (pagination.lastPage <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.current <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current >= pagination.lastPage - 2) {
                      pageNum = pagination.lastPage - 4 + i;
                    } else {
                      pageNum = pagination.current - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page ${pagination.current === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  className="pagination-btn"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(pagination.current + 1)}
                >
                  Next →
                </button>
                <button 
                  className="pagination-btn"
                  disabled={pagination.current === pagination.lastPage}
                  onClick={() => handlePageChange(pagination.lastPage)}
                  title="Last page"
                >
                  Last ⏭
                </button>
              </div>
            )}
          </>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">😢</div>
            <h2>No Results Found</h2>
            <p>
              We couldn&apos;t find any anime matching &quot;<strong>{query}</strong>&quot;.
            </p>
            <div className="suggestions">
              <p>Try:</p>
              <ul>
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Adjusting your filters</li>
                <li>Searching for popular titles like &quot;Naruto&quot; or &quot;One Piece&quot;</li>
              </ul>
            </div>
            <Link to="/" className="home-link">
              Back to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
