import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnimeDetailPage.module.css';

export default function AnimeHero({ 
  anime, 
  isAuthenticated, 
  isInWatchlist, 
  watchlistStatus,
  onAddToWatchlist, 
  onRemoveFromWatchlist,
  watchlistLoading 
}) {
  const navigate = useNavigate();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const bannerImage = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || '';
  const posterImage = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || '';

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const statusOptions = [
    { value: 'W', label: 'Watching', icon: '👁️' },
    { value: 'C', label: 'Completed', icon: '✅' },
    { value: 'H', label: 'On Hold', icon: '⏸️' },
    { value: 'D', label: 'Dropped', icon: '❌' },
    { value: 'PW', label: 'Plan to Watch', icon: '📋' },
  ];

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? `${option.icon} ${option.label}` : '📋 Plan to Watch';
  };

  const handleStatusSelect = (status) => {
    onAddToWatchlist(status);
    setShowStatusDropdown(false);
  };

  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isInWatchlist) {
      onRemoveFromWatchlist();
    } else {
      setShowStatusDropdown(!showStatusDropdown);
    }
  };

  return (
    <div className={styles.hero}>
      {/* Background Banner */}
      <div 
        className={styles.heroBanner} 
        style={{ backgroundImage: `url(${bannerImage})` }}
      />
      <div className={styles.heroOverlay} />

      {/* Content */}
      <div className={styles.heroContent}>
        {/* Poster */}
        <div className={styles.posterContainer}>
          <img 
            src={posterImage} 
            alt={anime?.title || 'Anime Poster'}
            className={styles.poster}
            loading="lazy"
          />
          
          {/* Watchlist Button - Below Poster */}
          <div className={styles.watchlistButtonContainer}>
            <button 
              className={`${styles.watchlistBtn} ${isInWatchlist ? styles.watchlistBtnActive : ''}`}
              onClick={handleWatchlistClick}
              disabled={watchlistLoading}
            >
              {watchlistLoading ? (
                <>
                  <span className={styles.watchlistSpinner}></span>
                  <span>Loading...</span>
                </>
              ) : isInWatchlist ? (
                <>
                  <span className={styles.watchlistIcon}>✓</span>
                  <span>{getStatusLabel(watchlistStatus)}</span>
                </>
              ) : (
                <>
                  <span className={styles.watchlistIcon}>+</span>
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            {/* Status Dropdown */}
            {showStatusDropdown && !isInWatchlist && (
              <div className={styles.statusDropdown}>
                <div className={styles.statusDropdownHeader}>Select Status</div>
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    className={styles.statusOption}
                    onClick={() => handleStatusSelect(option.value)}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className={styles.heroInfo}>
          {/* Titles */}
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{anime?.title || 'Unknown Title'}</h1>
            {anime?.title_english && anime.title_english !== anime.title && (
              <p className={styles.englishTitle}>{anime.title_english}</p>
            )}
            {anime?.title_japanese && (
              <p className={styles.japaneseTitle}>{anime.title_japanese}</p>
            )}
          </div>

          {/* Score & Stats */}
          <div className={styles.scoreSection}>
            <div className={styles.scoreBox}>
              <span className={styles.starIcon}>⭐</span>
              <span className={styles.scoreValue}>{anime?.score || 'N/A'}</span>
              <span className={styles.scoreMax}>/ 10</span>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>#{anime?.rank || 'N/A'}</div>
                <div className={styles.statLabel}>Rank</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>#{anime?.popularity || 'N/A'}</div>
                <div className={styles.statLabel}>Popularity</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{formatNumber(anime?.members)}</div>
                <div className={styles.statLabel}>Members</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{formatNumber(anime?.favorites)}</div>
                <div className={styles.statLabel}>Favorites</div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <AnimeMetaInfo anime={anime} />
        </div>
      </div>
    </div>
  );
}

function AnimeMetaInfo({ anime }) {
  const metaItems = [
    { icon: '📺', label: 'Type', value: anime?.type },
    { icon: '🎬', label: 'Episodes', value: anime?.episodes || '?' },
    { icon: '📡', label: 'Status', value: anime?.status },
    { icon: '📅', label: 'Aired', value: anime?.aired?.string },
    { icon: '⏱️', label: 'Duration', value: anime?.duration },
    { icon: '🔞', label: 'Rating', value: anime?.rating },
    { icon: '🗓️', label: 'Season', value: anime?.season && anime?.year ? `${anime.season} ${anime.year}` : null },
    { icon: '🏢', label: 'Source', value: anime?.source },
  ].filter(item => item.value);

  return (
    <div className={styles.metaInfo}>
      {metaItems.map((item, index) => (
        <div key={index} className={styles.metaItem}>
          <span className={styles.metaIcon}>{item.icon}</span>
          <span className={styles.metaValue}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
