import { Link } from 'react-router-dom';
import styles from './AnimeDetailPage.module.css';
import { GridSkeleton } from './Skeletons';

export default function RelatedAnime({ relations = [], loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>🔗</div>
          <h2 className={styles.sectionTitle}>Related Anime</h2>
        </div>
        <GridSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>🔗</div>
          <h2 className={styles.sectionTitle}>Related Anime</h2>
        </div>
        <div className={styles.synopsisContainer}>
          <p className={styles.synopsisText}>Failed to load related anime.</p>
          {onRetry && (
            <button className={styles.readMoreBtn} onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Flatten relations and filter for anime only
  const relatedItems = [];
  relations.forEach(relation => {
    relation.entry?.forEach(entry => {
      if (entry.type === 'anime') {
        relatedItems.push({
          ...entry,
          relation: relation.relation
        });
      }
    });
  });

  if (relatedItems.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🔗</div>
        <h2 className={styles.sectionTitle}>Related Anime ({relatedItems.length})</h2>
      </div>

      <div className={styles.relatedGrid}>
        {relatedItems.map((item) => (
          <Link 
            key={item.mal_id} 
            to={`/anime/${item.mal_id}`}
            className={styles.relatedCard}
          >
            <div className={styles.relatedImageContainer}>
              {/* Note: Relations don't include images, show placeholder or just info */}
              <div 
                className={styles.relatedImage} 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}
              >
                🎬
              </div>
              <span className={styles.relationBadge}>{item.relation}</span>
            </div>
            <div className={styles.relatedInfo}>
              <h4 className={styles.relatedTitle}>{item.name}</h4>
              <p className={styles.relatedType}>{item.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
