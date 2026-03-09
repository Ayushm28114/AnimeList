import styles from './AnimeDetailPage.module.css';

export default function AnimeInformationPanel({ anime }) {
  if (!anime) return null;

  // Extract all relevant data
  const producers = anime.producers || [];
  const licensors = anime.licensors || [];
  const demographics = anime.demographics || [];
  const themes = anime.themes || [];
  const synonyms = anime.titles?.filter(t => t.type === 'Synonym').map(t => t.title) || 
                   (anime.title_synonyms?.length > 0 ? anime.title_synonyms : []);
  const background = anime.background;
  const broadcast = anime.broadcast?.string;
  const externalLinks = anime.external || [];
  const streaming = anime.streaming || [];

  // Check if there's anything to display
  const hasContent = producers.length > 0 || licensors.length > 0 || 
                     demographics.length > 0 || themes.length > 0 ||
                     synonyms.length > 0 || background || broadcast ||
                     externalLinks.length > 0 || streaming.length > 0;

  if (!hasContent) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>📋</div>
        <h2 className={styles.sectionTitle}>Additional Details</h2>
      </div>
      
      <div className={styles.infoPanel}>
      {/* Alternative Titles Section */}
      {synonyms.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>📝</span>
            Alternative Titles
          </h3>
          <div className={styles.altTitlesList}>
            {synonyms.slice(0, 5).map((title, index) => (
              <span key={index} className={styles.altTitleItem}>
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Schedule */}
      {broadcast && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>📡</span>
            Broadcast
          </h3>
          <p className={styles.infoPanelText}>{broadcast}</p>
        </div>
      )}

      {/* Producers */}
      {producers.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>🎬</span>
            Producers
          </h3>
          <div className={styles.companyList}>
            {producers.map((producer) => (
              <a 
                key={producer.mal_id} 
                href={producer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.companyChip}
              >
                {producer.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Licensors */}
      {licensors.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>📜</span>
            Licensors
          </h3>
          <div className={styles.companyList}>
            {licensors.map((licensor) => (
              <a 
                key={licensor.mal_id} 
                href={licensor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.companyChip}
              >
                {licensor.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {themes.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>🎭</span>
            Themes
          </h3>
          <div className={styles.themeList}>
            {themes.map((theme) => (
              <span key={theme.mal_id} className={styles.themeChip}>
                {theme.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Demographics */}
      {demographics.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>👥</span>
            Demographics
          </h3>
          <div className={styles.demographicList}>
            {demographics.map((demo) => (
              <span key={demo.mal_id} className={styles.demographicChip}>
                {demo.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Streaming Platforms */}
      {streaming.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>📺</span>
            Where to Watch
          </h3>
          <div className={styles.streamingList}>
            {streaming.map((platform, index) => (
              <a 
                key={index} 
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.streamingChip}
              >
                <span className={styles.streamingIcon}>▶</span>
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {externalLinks.length > 0 && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>🔗</span>
            External Links
          </h3>
          <div className={styles.externalLinksList}>
            {externalLinks.slice(0, 6).map((link, index) => (
              <a 
                key={index} 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                <span className={styles.externalLinkIcon}>↗</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Background Info */}
      {background && (
        <div className={styles.infoPanelSection}>
          <h3 className={styles.infoPanelTitle}>
            <span className={styles.infoPanelIcon}>📖</span>
            Background
          </h3>
          <p className={styles.backgroundText}>{background}</p>
        </div>
      )}
      </div>
    </div>
  );
}
