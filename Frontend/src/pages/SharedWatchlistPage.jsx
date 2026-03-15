import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSharedWatchlist } from "../services/watchlistService";
import SectionLoader from "../Components/SectionLoader";
import "./SharedWatchlistPage.css";

export default function SharedWatchlistPage() {
  const { shareCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSharedWatchlist(shareCode);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch shared watchlist:", err);
        if (err.response?.status === 404) {
          setError("This watchlist doesn't exist or the link is invalid.");
        } else if (err.response?.status === 403) {
          setError("This watchlist is private and cannot be viewed.");
        } else {
          setError("Failed to load watchlist. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareCode]);

  const getFilteredWatchlist = () => {
    if (!data?.watchlist) return [];
    if (activeFilter === "all") return data.watchlist;
    if (activeFilter === "favorites") return data.watchlist.filter(item => item.is_favorite);
    
    const statusMap = {
      watching: "W",
      completed: "C",
      planToWatch: "PW",
      onHold: "OH",
      dropped: "D",
    };
    return data.watchlist.filter(item => item.status === statusMap[activeFilter]);
  };

  const getStatusLabel = (status) => {
    const labels = {
      W: "Watching",
      C: "Completed",
      PW: "Plan to Watch",
      OH: "On Hold",
      D: "Dropped",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      W: "watching",
      C: "completed",
      PW: "plan-to-watch",
      OH: "on-hold",
      D: "dropped",
    };
    return classes[status] || "";
  };

  if (loading) {
    return (
      <div className="shared-watchlist-page">
        <SectionLoader message="Loading shared watchlist..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-watchlist-page">
        <div className="shared-error">
          <div className="error-icon">😢</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <Link to="/" className="home-btn">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-watchlist-page">
      {/* Header */}
      <header className="shared-header">
        <div className="shared-header-content">
          <div className="user-avatar">
            {data?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <h1>{data?.username}&apos;s Watchlist</h1>
            <p>Shared anime collection</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="shared-stats">
        <div className="stat-card">
          <span className="stat-value">{data?.stats?.total || 0}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data?.stats?.watching || 0}</span>
          <span className="stat-label">Watching</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data?.stats?.completed || 0}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data?.stats?.plan_to_watch || 0}</span>
          <span className="stat-label">Plan to Watch</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data?.stats?.favorites || 0}</span>
          <span className="stat-label">Favorites</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="shared-tabs">
        {["all", "favorites", "watching", "completed", "planToWatch", "onHold", "dropped"].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeFilter === tab ? "active" : ""}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab === "all" ? "All" :
             tab === "favorites" ? "❤️ Favorites" :
             tab === "watching" ? "Watching" :
             tab === "completed" ? "Completed" :
             tab === "planToWatch" ? "Plan to Watch" :
             tab === "onHold" ? "On Hold" : "Dropped"}
          </button>
        ))}
      </div>

      {/* Anime Grid */}
      <div className="shared-content">
        {getFilteredWatchlist().length > 0 ? (
          <div className="anime-grid">
            {getFilteredWatchlist().map((item, index) => (
              <Link 
                key={`${item.anime_id}-${index}`}
                to={`/anime/${item.anime_id}`}
                className="anime-card"
              >
                <img
                  src={item.anime_image || `https://via.placeholder.com/150x225?text=${encodeURIComponent(item.anime_title?.[0] || "A")}`}
                  alt={item.anime_title}
                  className="anime-poster"
                />
                <span className={`status-badge ${getStatusClass(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
                {item.is_favorite && (
                  <span className="favorite-badge">❤️</span>
                )}
                <div className="anime-info">
                  <h3 className="anime-title">{item.anime_title || `Anime #${item.anime_id}`}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <p>No anime in this category.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="shared-footer">
        <p>
          Want to create your own watchlist?{" "}
          <Link to="/register">Sign up</Link> for free!
        </p>
      </footer>
    </div>
  );
}
