import { Link } from 'react-router-dom';
import styles from './AnimeDetailPage.module.css';
import { GridSkeleton } from './Skeletons';

export default function RecommendationsGrid({ recommendations = [], loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>💡</div>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
        </div>
        <GridSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>💡</div>
          <h2 className={styles.sectionTitle}>Recommendations</h2>
        </div>
        <div className={styles.synopsisContainer}>
          <p className={styles.synopsisText}>Failed to load recommendations.</p>
          {onRetry && (
            <button className={styles.readMoreBtn} onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>💡</div>
        <h2 className={styles.sectionTitle}>Recommendations ({recommendations.length})</h2>
      </div>

      <div className={styles.recommendationsGrid}>
        {recommendations.slice(0, 12).map((item) => {
          const anime = item.entry;
          
          return (
            <Link 
              key={anime?.mal_id} 
              to={`/anime/${anime?.mal_id}`}
              className={styles.recommendationCard}
            >
              <div className={styles.recommendationImageContainer}>
                <img
                  src={anime?.images?.jpg?.image_url || '/placeholder.png'}
                  alt={anime?.title || 'Recommendation'}
                  className={styles.recommendationImage}
                  loading="lazy"
                />
                {item.votes > 0 && (
                  <span className={styles.recommendationVotes}>
                    👍 {item.votes}
                  </span>
                )}
              </div>
              <div className={styles.recommendationInfo}>
                <h4 className={styles.recommendationTitle}>{anime?.title}</h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
