import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchAnime } from "../services/animeService";
import { AnimeCardContainer } from "../Components/AnimeCard";
import SectionLoader from "../Components/SectionLoader";
import SectionError from "../Components/SectionError";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      try {
        const data = await searchAnime(query);
        setResults(data || []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleRetry = () => {
    if (query.trim()) {
      setLoading(true);
      setError(null);
      searchAnime(query)
        .then(data => setResults(data || []))
        .catch(() => setError("Failed to fetch search results."))
        .finally(() => setLoading(false));
    }
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
              Search Results for "<span className="search-query">{query}</span>"
            </>
          ) : (
            "Search Anime"
          )}
        </h1>
        {hasSearched && !loading && !error && (
          <p className="results-count">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="search-page-content">
        {!query && (
          <div className="no-query">
            <div className="no-query-icon">🔍</div>
            <h2>Start Your Search</h2>
            <p>Use the search bar in the navigation to find your favorite anime!</p>
            <Link to="/" className="home-link">
              Go to Homepage
            </Link>
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
          <AnimeCardContainer 
            animeList={results} 
            title=""
          />
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">😢</div>
            <h2>No Results Found</h2>
            <p>
              We couldn't find any anime matching "<strong>{query}</strong>".
            </p>
            <div className="suggestions">
              <p>Try:</p>
              <ul>
                <li>Checking your spelling</li>
                <li>Using different keywords</li>
                <li>Searching for popular titles like "Naruto" or "One Piece"</li>
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
