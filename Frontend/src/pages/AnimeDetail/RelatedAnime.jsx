import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AnimeDetailPage.module.css';
import { GridSkeleton } from './Skeletons';

const INITIAL_SHOW_COUNT = 6;

// Generate a gradient based on the anime ID for visual variety
const getGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  ];
  return gradients[id % gradients.length];
};

export default function RelatedAnime({ relations = [], loading = false, error = null, onRetry }) {
  const [showAll, setShowAll] = useState(false);

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

  // Determine which items to display
  const displayedItems = showAll ? relatedItems : relatedItems.slice(0, INITIAL_SHOW_COUNT);
  const hasMore = relatedItems.length > INITIAL_SHOW_COUNT;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🔗</div>
        <h2 className={styles.sectionTitle}>Related Anime ({relatedItems.length})</h2>
      </div>

      <div className={styles.relatedGrid}>
        {displayedItems.map((item) => (
          <Link 
            key={item.mal_id} 
            to={`/anime/${item.mal_id}`}
            className={styles.relatedCard}
          >
            <div className={styles.relatedImageContainer}>
              <div 
                className={styles.relatedImagePlaceholder}
                style={{ background: getGradient(item.mal_id) }}
              >
                <span className={styles.relatedInitial}>
                  {item.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
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

      {/* See More / See Less Button */}
      {hasMore && (
        <div className={styles.seeMoreContainer}>
          <button 
            className={styles.seeMoreBtn}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `See More (${relatedItems.length - INITIAL_SHOW_COUNT} more)`}
          </button>
        </div>
      )}
    </div>
  );
}
