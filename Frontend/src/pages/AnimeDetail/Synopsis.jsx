import { useState } from 'react';
import styles from './AnimeDetailPage.module.css';

export default function Synopsis({ text }) {
  const [expanded, setExpanded] = useState(false);
  
  if (!text) return null;

  const isLong = text.length > 400;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>📖</div>
        <h2 className={styles.sectionTitle}>Synopsis</h2>
      </div>
      
      <div className={styles.synopsisContainer}>
        <p className={`${styles.synopsisText} ${!expanded && isLong ? styles.collapsed : ''}`}>
          {text}
        </p>
        {isLong && (
          <button 
            className={styles.readMoreBtn}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '▲ Read Less' : '▼ Read More'}
          </button>
        )}
      </div>
    </div>
  );
}
