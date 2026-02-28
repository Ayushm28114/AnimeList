import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import {
  getAnimeDetails,
  getAnimeCharacters,
  getAnimeRecommendations,
  getAnimeRelations,
  getAnimeStatistics,
} from '../../services/animeService';
import { clearQueue } from '../../utils/rateLimiter';

import styles from './AnimeDetailPage.module.css';
import { HeroSkeleton } from './Skeletons';
import AnimeHero from './AnimeHero';
import GenreChips from './GenreChips';
import Synopsis from './Synopsis';
import TrailerSection from './TrailerSection';
import ThemeSongs from './ThemeSongs';
import CharactersCarousel from './CharactersCarousel';
import RelatedAnime from './RelatedAnime';
import StatisticsSection from './StatisticsSection';
import RecommendationsGrid from './RecommendationsGrid';
import ReviewsSection from './ReviewsSection';

export default function AnimeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const animeId = Number(id);
  const isMountedRef = useRef(true);

  // Main anime data
  const [anime, setAnime] = useState(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [animeError, setAnimeError] = useState(null);

  // Characters
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [charactersError, setCharactersError] = useState(null);

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState(null);

  // Relations
  const [relations, setRelations] = useState([]);
  const [loadingRelations, setLoadingRelations] = useState(true);
  const [relationsError, setRelationsError] = useState(null);

  // Statistics
  const [statistics, setStatistics] = useState(null);
  const [loadingStatistics, setLoadingStatistics] = useState(true);
  const [statisticsError, setStatisticsError] = useState(null);

  // Fetch main anime details
  const fetchAnime = useCallback(async () => {
    setLoadingAnime(true);
    setAnimeError(null);
    try {
      const data = await getAnimeDetails(animeId);
      if (isMountedRef.current) {
        setAnime(data);
      }
    } catch (err) {
      console.error('Failed to load anime:', err);
      if (isMountedRef.current) {
        setAnimeError('Failed to load anime details');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingAnime(false);
      }
    }
  }, [animeId]);

  // Fetch characters
  const fetchCharacters = useCallback(async () => {
    setLoadingCharacters(true);
    setCharactersError(null);
    try {
      const data = await getAnimeCharacters(animeId);
      if (isMountedRef.current) {
        setCharacters(data);
      }
    } catch (err) {
      console.error('Failed to load characters:', err);
      if (isMountedRef.current) {
        setCharactersError('Failed to load characters');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingCharacters(false);
      }
    }
  }, [animeId]);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    setLoadingRecommendations(true);
    setRecommendationsError(null);
    try {
      const data = await getAnimeRecommendations(animeId);
      if (isMountedRef.current) {
        setRecommendations(data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      if (isMountedRef.current) {
        setRecommendationsError('Failed to load recommendations');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingRecommendations(false);
      }
    }
  }, [animeId]);

  // Fetch relations
  const fetchRelations = useCallback(async () => {
    setLoadingRelations(true);
    setRelationsError(null);
    try {
      const data = await getAnimeRelations(animeId);
      if (isMountedRef.current) {
        setRelations(data);
      }
    } catch (err) {
      console.error('Failed to load relations:', err);
      if (isMountedRef.current) {
        setRelationsError('Failed to load relations');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingRelations(false);
      }
    }
  }, [animeId]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setLoadingStatistics(true);
    setStatisticsError(null);
    try {
      const data = await getAnimeStatistics(animeId);
      if (isMountedRef.current) {
        setStatistics(data);
      }
    } catch (err) {
      console.error('Failed to load statistics:', err);
      if (isMountedRef.current) {
        setStatisticsError('Failed to load statistics');
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingStatistics(false);
      }
    }
  }, [animeId]);

  // Helper function to delay execution
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Staggered fetch to avoid rate limiting
  // Jikan API allows ~3 requests per second, so we space them out
  const fetchAllData = useCallback(async () => {
    // Clear any pending requests from previous loads
    clearQueue();

    // Fetch main anime data first (most important)
    await fetchAnime();
    
    // Add a small delay before starting supplementary data fetches
    await delay(400);
    
    // Fetch supplementary data sequentially with delays to avoid rate limiting
    // Characters (usually most important supplementary data)
    fetchCharacters();
    await delay(500);
    
    // Relations (important for navigation)
    if (isMountedRef.current) {
      fetchRelations();
      await delay(500);
    }
    
    // Statistics 
    if (isMountedRef.current) {
      fetchStatistics();
      await delay(500);
    }
    
    // Recommendations (least priority, load last)
    if (isMountedRef.current) {
      fetchRecommendations();
    }
  }, [fetchAnime, fetchCharacters, fetchRelations, fetchStatistics, fetchRecommendations]);

  // Scroll to top when anime ID changes (navigating to a new anime)
  // Using useLayoutEffect to ensure scroll happens before browser paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [animeId]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    
    fetchAllData();

    return () => {
      isMountedRef.current = false;
      clearQueue(); // Clear queue on unmount
    };
  }, [fetchAllData]);

  // Loading state
  if (loadingAnime) {
    return (
      <div className={styles.pageContainer}>
        <HeroSkeleton />
      </div>
    );
  }

  // Error state
  if (animeError) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>😢</div>
          <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
          <p className={styles.errorMessage}>{animeError}</p>
          <button className={styles.retryBtn} onClick={fetchAnime}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!anime) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.notFoundContainer}>
          <div className={styles.notFoundIcon}>🔍</div>
          <h2 className={styles.errorTitle}>Anime Not Found</h2>
          <p className={styles.errorMessage}>
            The anime you're looking for doesn't exist or has been removed.
          </p>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <AnimeHero anime={anime} />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Genres & Studios */}
        <GenreChips 
          genres={anime.genres || []} 
          studios={anime.studios || []} 
        />

        {/* Synopsis */}
        <Synopsis text={anime.synopsis} />

        {/* Trailer */}
        <TrailerSection trailer={anime.trailer} />

        {/* Theme Songs */}
        <ThemeSongs 
          openings={anime.theme?.openings || []} 
          endings={anime.theme?.endings || []} 
        />

        {/* Characters */}
        <CharactersCarousel 
          characters={characters}
          loading={loadingCharacters}
          error={charactersError}
          onRetry={fetchCharacters}
        />

        {/* Two Column Layout for Relations & Statistics */}
        <div className={styles.twoColumnGrid}>
          <RelatedAnime 
            relations={relations}
            loading={loadingRelations}
            error={relationsError}
            onRetry={fetchRelations}
          />

          <StatisticsSection 
            statistics={statistics}
            loading={loadingStatistics}
            error={statisticsError}
            onRetry={fetchStatistics}
          />
        </div>

        {/* Recommendations */}
        <RecommendationsGrid 
          recommendations={recommendations}
          loading={loadingRecommendations}
          error={recommendationsError}
          onRetry={fetchRecommendations}
        />

        {/* Reviews */}
        <ReviewsSection animeId={animeId} />
      </div>
    </div>
  );
}
