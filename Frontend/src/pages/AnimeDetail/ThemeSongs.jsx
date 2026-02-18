import styles from './AnimeDetailPage.module.css';

export default function ThemeSongs({ openings = [], endings = [] }) {
  if (openings.length === 0 && endings.length === 0) return null;

  const parseThemeSong = (song) => {
    // Theme songs come as strings, we just display them
    return song;
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🎵</div>
        <h2 className={styles.sectionTitle}>Theme Songs</h2>
      </div>
      
      <div className={styles.themeSongsGrid}>
        {openings.length > 0 && (
          <div className={styles.themeSection}>
            <h3 className={styles.themeTitle}>
              🎤 Opening Themes ({openings.length})
            </h3>
            <ul className={styles.themeList}>
              {openings.map((song, index) => (
                <li key={index} className={styles.themeItem}>
                  <span className={styles.themeNumber}>#{index + 1}</span>
                  {parseThemeSong(song, index)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {endings.length > 0 && (
          <div className={styles.themeSection}>
            <h3 className={styles.themeTitle}>
              🎧 Ending Themes ({endings.length})
            </h3>
            <ul className={styles.themeList}>
              {endings.map((song, index) => (
                <li key={index} className={styles.themeItem}>
                  <span className={styles.themeNumber}>#{index + 1}</span>
                  {parseThemeSong(song, index)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
