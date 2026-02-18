import styles from './AnimeDetailPage.module.css';

export default function TrailerSection({ trailer }) {
  if (!trailer?.embed_url) return null;

  // Convert YouTube URL to embed URL with parameters
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Add autoplay=0 and other parameters
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=0&rel=0`;
  };

  const embedUrl = getEmbedUrl(trailer.embed_url);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🎥</div>
        <h2 className={styles.sectionTitle}>Trailer</h2>
      </div>
      
      <div className={styles.trailerContainer}>
        <iframe
          className={styles.trailerIframe}
          src={embedUrl}
          title="Anime Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
