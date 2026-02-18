import styles from './AnimeDetailPage.module.css';
import { CardsSkeleton } from './Skeletons';

export default function CharactersCarousel({ characters = [], loading = false, error = null, onRetry }) {
  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>👥</div>
          <h2 className={styles.sectionTitle}>Characters</h2>
        </div>
        <CardsSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>👥</div>
          <h2 className={styles.sectionTitle}>Characters</h2>
        </div>
        <div className={styles.synopsisContainer}>
          <p className={styles.synopsisText}>Failed to load characters.</p>
          {onRetry && (
            <button className={styles.readMoreBtn} onClick={onRetry}>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (characters.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>👥</div>
        <h2 className={styles.sectionTitle}>Characters ({characters.length})</h2>
      </div>

      <div className={styles.carouselContainer}>
        <div className={styles.carousel}>
          {characters.slice(0, 20).map((item) => {
            const character = item.character;
            const voiceActor = item.voice_actors?.find(va => va.language === 'Japanese');
            
            return (
              <div key={character?.mal_id} className={styles.characterCard}>
                <div className={styles.characterImageContainer}>
                  <img
                    src={character?.images?.jpg?.image_url || '/placeholder.png'}
                    alt={character?.name || 'Character'}
                    className={styles.characterImage}
                    loading="lazy"
                  />
                  <span className={`${styles.characterRole} ${item.role?.toLowerCase() === 'main' ? styles.main : styles.supporting}`}>
                    {item.role}
                  </span>
                </div>
                <div className={styles.characterInfo}>
                  <h4 className={styles.characterName}>{character?.name}</h4>
                  {voiceActor && (
                    <p className={styles.voiceActor}>🎙️ {voiceActor.person?.name}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
