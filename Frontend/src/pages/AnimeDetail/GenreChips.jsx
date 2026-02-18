import styles from './AnimeDetailPage.module.css';

export default function GenreChips({ genres = [], studios = [] }) {
  if (genres.length === 0 && studios.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🏷️</div>
        <h2 className={styles.sectionTitle}>Genres & Studios</h2>
      </div>
      
      <div className={styles.genreContainer}>
        {genres.map((genre) => (
          <span key={genre.mal_id} className={styles.genreChip}>
            {genre.name}
          </span>
        ))}
        {studios.map((studio) => (
          <span key={studio.mal_id} className={styles.studioChip}>
            🎬 {studio.name}
          </span>
        ))}
      </div>
    </div>
  );
}
