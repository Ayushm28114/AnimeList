import styles from './AnimeDetailPage.module.css';

export default function AnimeHero({ anime }) {
  const bannerImage = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || '';
  const posterImage = anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url || '';

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
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
