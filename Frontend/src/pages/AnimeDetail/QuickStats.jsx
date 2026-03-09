import styles from './AnimeDetailPage.module.css';

export default function QuickStats({ anime }) {
  if (!anime) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  }

  // Airing information
  const airingInfo = {
    start: anime.aired?.from ? formatDate(anime.aired.from) : 'TBA',
    end: anime.aired?.to ? formatDate(anime.aired.to) : (anime.status === 'Currently Airing' ? 'Ongoing' : 'TBA'),
  };

  // Key stats to display (avoiding duplicates from hero)
  const infoCards = [
    { icon: '📺', label: 'Type', value: anime.type || 'Unknown' },
    { icon: '🎬', label: 'Episodes', value: anime.episodes || '?' },
    { icon: '⏱️', label: 'Duration', value: anime.duration || 'Unknown' },
    { icon: '🏢', label: 'Source', value: anime.source || 'Unknown' },
    { icon: '🔞', label: 'Rating', value: anime.rating?.split(' - ')[0] || 'N/A' },
    { icon: '📊', label: 'Scored By', value: anime.scored_by ? formatNumber(anime.scored_by) : 'N/A' },
  ];

  return (
    <div className={styles.quickStatsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>📈</div>
        <h2 className={styles.sectionTitle}>Anime Information</h2>
      </div>

      <div className={styles.quickStatsWrapper}>
        {/* Info Cards Grid */}
        <div className={styles.infoCardsGrid}>
          {infoCards.map((item, index) => (
            <div key={index} className={styles.infoCard}>
              <span className={styles.infoCardIcon}>{item.icon}</span>
              <div className={styles.infoCardContent}>
                <span className={styles.infoCardLabel}>{item.label}</span>
                <span className={styles.infoCardValue}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Airing Timeline */}
        <div className={styles.airingSection}>
          <h3 className={styles.airingSectionTitle}>📅 Airing Schedule</h3>
          <div className={styles.airingTimeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>🚀</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineLabel}>Started</div>
                <div className={styles.timelineValue}>{airingInfo.start}</div>
              </div>
            </div>
            <div className={styles.timelineLine}></div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>{anime.status === 'Currently Airing' ? '📡' : '🏁'}</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineLabel}>{anime.status === 'Currently Airing' ? 'Status' : 'Ended'}</div>
                <div className={styles.timelineValue}>{airingInfo.end}</div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={styles.statusBadgeContainer}>
            <span className={`${styles.statusBadge} ${styles[`status${anime.status?.replace(/\s/g, '')}`]}`}>
              {anime.status || 'Unknown Status'}
            </span>
            {anime.season && anime.year && (
              <span className={styles.seasonBadge}>
                {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
