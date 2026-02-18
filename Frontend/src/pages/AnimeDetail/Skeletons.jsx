import styles from './AnimeDetailPage.module.css';

// Skeleton loader for the hero section
export function HeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.posterContainer}>
          <div className={`${styles.skeleton} ${styles.skeletonPoster}`}></div>
        </div>
        <div className={styles.heroInfo} style={{ width: '100%' }}>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
          <div className={`${styles.skeleton} ${styles.skeletonTextShort}`}></div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div className={styles.skeleton} style={{ width: '120px', height: '60px' }}></div>
            <div className={styles.skeleton} style={{ width: '80px', height: '60px' }}></div>
            <div className={styles.skeleton} style={{ width: '80px', height: '60px' }}></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton} style={{ width: '100px', height: '40px' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for cards (characters, recommendations, etc.)
export function CardsSkeleton({ count = 6 }) {
  return (
    <div className={styles.carousel}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles.characterCard}`} style={{ height: '280px' }}></div>
      ))}
    </div>
  );
}

// Skeleton for grid items
export function GridSkeleton({ count = 8 }) {
  return (
    <div className={styles.recommendationsGrid}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles.skeletonCard}`}></div>
      ))}
    </div>
  );
}

// Skeleton for synopsis
export function SynopsisSkeleton() {
  return (
    <div className={styles.synopsisContainer}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`${styles.skeleton} ${styles.skeletonText}`}></div>
      ))}
      <div className={`${styles.skeleton} ${styles.skeletonTextShort}`}></div>
    </div>
  );
}

// Skeleton for stats
export function StatsSkeleton() {
  return (
    <div className={styles.statsContainer}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.statBar}>
          <div className={`${styles.skeleton}`} style={{ width: '100px', height: '20px' }}></div>
          <div className={`${styles.skeleton}`} style={{ flex: 1, height: '8px' }}></div>
          <div className={`${styles.skeleton}`} style={{ width: '60px', height: '20px' }}></div>
        </div>
      ))}
    </div>
  );
}
