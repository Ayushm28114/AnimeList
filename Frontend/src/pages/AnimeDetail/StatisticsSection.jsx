import styles from './AnimeDetailPage.module.css';
import { StatsSkeleton } from './Skeletons';

export default function StatisticsSection({ statistics, loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>📊</div>
          <h2 className={styles.sectionTitle}>Statistics</h2>
        </div>
        <StatsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>📊</div>
          <h2 className={styles.sectionTitle}>Statistics</h2>
        </div>
        <div className={styles.synopsisContainer}>
          <p className={styles.synopsisText}>Failed to load statistics.</p>
          {onRetry && (
            <button className={styles.readMoreBtn} onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!statistics || Object.keys(statistics).length === 0) return null;

  const total = (statistics.watching || 0) + 
                (statistics.completed || 0) + 
                (statistics.on_hold || 0) + 
                (statistics.dropped || 0) + 
                (statistics.plan_to_watch || 0);

  const getPercentage = (value) => {
    if (!total || !value) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const stats = [
    { label: 'Watching', value: statistics.watching, class: 'watching' },
    { label: 'Completed', value: statistics.completed, class: 'completed' },
    { label: 'On Hold', value: statistics.on_hold, class: 'onHold' },
    { label: 'Dropped', value: statistics.dropped, class: 'dropped' },
    { label: 'Plan to Watch', value: statistics.plan_to_watch, class: 'planToWatch' },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>📊</div>
        <h2 className={styles.sectionTitle}>Statistics</h2>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statBar}>
              <span className={styles.statBarLabel}>{stat.label}</span>
              <div className={styles.statBarTrack}>
                <div 
                  className={`${styles.statBarFill} ${styles[stat.class]}`}
                  style={{ width: `${getPercentage(stat.value)}%` }}
                />
              </div>
              <span className={styles.statBarCount}>{formatNumber(stat.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
