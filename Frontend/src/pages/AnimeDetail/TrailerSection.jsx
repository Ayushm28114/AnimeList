import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AnimeDetailPage.module.css';

export default function TrailerSection({ trailer }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Extract YouTube video ID from embed URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    // Handle different YouTube URL formats
    const patterns = [
      /embed\/([^?&]+)/,
      /v=([^&]+)/,
      /youtu\.be\/([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Convert YouTube URL to embed URL with API enabled
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // If it's already an embed URL, just add params
    if (url.includes('embed')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}enablejsapi=1&rel=0&autoplay=1`;
    }
    // Otherwise extract video ID and create embed URL
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&autoplay=1`;
    }
    return null;
  };

  const videoId = trailer?.youtube_id || getYouTubeId(trailer?.embed_url || trailer?.url);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : (trailer?.images?.maximum_image_url || trailer?.images?.large_image_url || null);
  const embedUrl = trailer?.embed_url 
    ? getEmbedUrl(trailer.embed_url) 
    : (videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&autoplay=1` : null);

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

  // Handle play button click - this loads the iframe and starts playing
  const handlePlay = () => {
    setHasInteracted(true);
    setIsPlaying(true);
    setIframeLoaded(true);
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

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>🎥</div>
        <h2 className={styles.sectionTitle}>Trailer</h2>
      </div>
      
      {/* Show fallback message if no trailer available */}
      {!embedUrl ? (
        <div className={styles.noTrailerMessage}>
          <div className={styles.noTrailerIcon}>📹</div>
          <p>No trailer available for this anime.</p>
        </div>
      ) : (
      <div className={styles.trailerWrapper}>
        <div 
          ref={containerRef}
          className={`${styles.trailerContainer} ${isPlaying ? styles.playing : ''}`}
        >
          {/* Status indicator - only show after interaction */}
          {iframeLoaded && (
            <div className={styles.trailerStatus}>
              <span className={`${styles.statusDot} ${isPlaying && isInView ? styles.active : ''}`}></span>
              <span>{isPlaying && isInView ? 'Playing' : 'Paused'}</span>
            </div>
          )}

          {/* Show thumbnail before interaction, iframe after */}
          {iframeLoaded ? (
            <iframe
              ref={iframeRef}
              className={styles.trailerIframe}
              src={embedUrl}
              title="Anime Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Thumbnail background */}
              {thumbnailUrl && (
                <img 
                  src={thumbnailUrl} 
                  alt="Trailer thumbnail"
                  className={styles.trailerThumbnail}
                  onError={(e) => {
                    // Try different fallback images
                    const fallbacks = [
                      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                      `https://img.youtube.com/vi/${videoId}/default.jpg`
                    ];
                    const currentSrc = e.target.src;
                    const nextFallback = fallbacks.find(f => f !== currentSrc && !e.target.dataset.tried?.includes(f));
                    if (nextFallback) {
                      e.target.dataset.tried = (e.target.dataset.tried || '') + nextFallback;
                      e.target.src = nextFallback;
                    }
                  }}
                />
              )}
              {/* Play overlay */}
              <div className={styles.trailerOverlay} onClick={handlePlay}>
                <div className={styles.playButton}>▶</div>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
