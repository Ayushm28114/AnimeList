import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AnimeDetailPage.module.css';

export default function TrailerSection({ trailer }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Convert YouTube URL to embed URL with API enabled
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}enablejsapi=1&rel=0&autoplay=0`;
  };

  const embedUrl = trailer?.embed_url ? getEmbedUrl(trailer.embed_url) : null;

  // Post message to YouTube iframe
  const postMessage = useCallback((action) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: action, args: [] }),
        '*'
      );
    }
  }, []);

  // Handle pause
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    postMessage('pauseVideo');
  }, [postMessage]);

  // Handle play
  const handleResume = useCallback(() => {
    if (hasInteracted) {
      setIsPlaying(true);
      postMessage('playVideo');
    }
  }, [hasInteracted, postMessage]);

  // Handle play button click
  const handlePlay = () => {
    setHasInteracted(true);
    setIsPlaying(true);
    postMessage('playVideo');
  };

  // Intersection Observer for scroll-based play/pause
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
          setIsInView(inView);

          if (inView && hasInteracted) {
            handleResume();
          } else if (!inView && isPlaying) {
            handlePause();
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [embedUrl, hasInteracted, isPlaying, handlePause, handleResume]);

  // Don't render if no trailer
  if (!embedUrl) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🎥</div>
        <h2 className={styles.sectionTitle}>Trailer</h2>
      </div>
      
      <div className={styles.trailerWrapper}>
        <div 
          ref={containerRef}
          className={`${styles.trailerContainer} ${isPlaying ? styles.playing : ''}`}
        >
          {/* Status indicator */}
          <div className={styles.trailerStatus}>
            <span className={`${styles.statusDot} ${isPlaying && isInView ? styles.active : ''}`}></span>
            <span>{isPlaying && isInView ? 'Playing' : hasInteracted ? 'Paused' : 'Ready'}</span>
          </div>

          <iframe
            ref={iframeRef}
            className={styles.trailerIframe}
            src={embedUrl}
            title="Anime Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />

          {/* Play overlay - shown until first interaction */}
          {!hasInteracted && (
            <div className={styles.trailerOverlay} onClick={handlePlay}>
              <div className={styles.playButton}>▶</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
