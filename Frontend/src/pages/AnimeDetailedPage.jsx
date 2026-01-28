import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {getAnimeDetails, getAnimeReviews, createReview} from '../services/animeService';
import { useAuth } from '../context/AuthContext';
import './styler.css';
// import { fetchWatchlist, addToWatchlist, removeFromWatchlist, findWatchlistItem } from "../services/watchlistService";


function AnimeDetailedPage() {
    const {id} = useParams();
    const animeId = Number(id);
    const { isAuthenticated } = useAuth();

    const [anime, setAnime] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingAnime, setLoadingAnime] = useState(true);
    const [loadingReview, setLoadingReview] = useState(true);
    const [error, setError] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        ratings: "",
        text: ""
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    // const [watchlist, setWatchlist] = useState([]);
    // const [watchlistLoading, setWatchlistLoading] = useState(true);     
    // const [watchlistActionLoading, setWatchlistActionLoading] = useState(false);    

    // Watchlist useEffect below this ****
//     useEffect(() => {
//   async function loadWatchlist() {
//     if (!isAuthenticated) {
//       setWatchlist([]); setWatchlistLoading(false); return;
//     }
//     setWatchlistLoading(true);
//     try {
//       const wl = await fetchWatchlist();
//       // if backend returns {results: [...] } adjust accordingly
//       setWatchlist(Array.isArray(wl) ? wl : (wl.results || []));
//     } catch (err) {
//       console.error("Failed to load watchlist", err);
//     } finally {
//       setWatchlistLoading(false);
//     }
//   }
//   loadWatchlist();
// }, [isAuthenticated]);

// // helper to check if current anime is in watchlist
// const currentWatchItem = findWatchlistItem(watchlist, animeId);

// // add/remove handlers
// const handleAddToWatchlist = async (status = "PTW") => {
//   if (!isAuthenticated) { alert("Login to add to watchlist"); return; }
//   setWatchlistActionLoading(true);
//   try {
//     const newItem = await addToWatchlist(animeId, status);
//     // keep UI in sync
//     setWatchlist(prev =>
//         prev.some(i => i.anime_id === animeId)
//             ? prev
//             : [...prev, newItem]
//     );

//   } catch (err) {
//     console.error(err);
//     alert("Could not add to watchlist");
//   } finally { setWatchlistActionLoading(false); }
// };

// const handleRemoveFromWatchlist = async (itemId) => {
//   if (!isAuthenticated) { alert("Login to remove from watchlist"); return; }
//   setWatchlistActionLoading(true);
//   try {
//     await removeFromWatchlist(itemId);
//     setWatchlist(prev => prev.filter(i => i.id !== itemId));
//   } catch (err) {
//     console.error(err);
//     alert("Could not remove from watchlist");
//   } finally { setWatchlistActionLoading(false); }
// };    

    useEffect(() => {
        async function fetchAnime() {
            setLoadingAnime(true);
            setError(null);
            try {
                const data = await getAnimeDetails(animeId);
                setAnime(data);
            }
            catch(err){
                console.log(err);
                setError("Failed to load anime details...");
            }
            finally {
                setLoadingAnime(false);
            }
        }

        async function fetchReviews() {
            setLoadingReview(true);
            setError(null);
            try {
                const data = await getAnimeReviews(animeId);
                setReviews(data);
            }            
            catch(err) {
                console.log(err);
                setError("Failed to load Reviews...");
            }
            finally {
                setLoadingReview(false);
            }
        }
        fetchAnime();
        fetchReviews();
    },[animeId]);

    // Scroll to top functionality
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleReviewChange = (e) => {
        setReviewForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.ratings) {
            return;
        }
        setSubmittingReview(true);
        try {
            await createReview(animeId, Number(reviewForm.ratings), reviewForm.text);
            const updated = await getAnimeReviews(animeId);
            setReviews(updated);
            setReviewForm({ratings: "", text: ""});
        }
        catch(err) {
            console.log(err);
            setError("Failed to submit review...");
        }
        finally {
            setSubmittingReview(false);
        }
    };

    // Loading Component
    const LoadingScreen = () => (
        <div className="loading-container">
            <div className="loading-background">
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
            </div>
            <div className="loading-content">
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <div className="loading-character">🎌</div>
                <h2 className="loading-title">Loading Anime Details</h2>
                <p className="loading-text">Fetching amazing content for you...</p>
                <div className="loading-progress">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <p className="progress-text">Discovering epic adventures...</p>
                </div>
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );

    // Error Component
    const ErrorScreen = () => (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">😢</div>
                <h2 className="error-title">Oops! Something went wrong</h2>
                <p className="error-message">{error}</p>
                <button 
                    className="retry-button" 
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Not Found Component
    const NotFoundScreen = () => (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">🔍</div>
                <h2 className="not-found-title">Anime Not Found</h2>
                <p className="not-found-message">
                    The anime you're looking for doesn't exist or has been removed.
                </p>
                <button 
                    className="back-button" 
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    if (loadingAnime) return <LoadingScreen />;
    if (error) return <ErrorScreen />;
    if(!anime) return <NotFoundScreen />;

    const img = 
    anime.images?.jpg?.large_image_url || 
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.image_url ||
    "";

    return (
        <div className="anime-detail-page">
            {/* Hero Section */}
            <div className="anime-hero">
                <div className="anime-hero-bg" style={{backgroundImage: `url(${img})`}}></div>
                <div className="anime-hero-content">
                    <div className="anime-poster">
                        {img && (
                            <img 
                                src={img} 
                                alt={anime.title}
                                className="poster-image"
                            />
                        )}
                        <div className="poster-overlay">
                            <div className="rating-badge">
                                <span className="rating-icon">⭐</span>
                                <span className="rating-score">{anime.score ?? "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="anime-info">
                        <div className="anime-header">
                            <h1 className="anime-title">{anime.title}</h1>
                            {anime.title_english && (
                                <h2 className="anime-subtitle">{anime.title_english}</h2>
                            )}
                        </div>
                        
                        <div className="anime-meta">
                            <div className="meta-grid">
                                <div className="meta-item">
                                    <span className="meta-label">📺 Episodes</span>
                                    <span className="meta-value">{anime.episodes ?? "N/A"}</span>
                                    {anime.episodes && (
                                        <div className="meta-progress">
                                            <div className="progress-dots">
                                                {'●'.repeat(Math.min(anime.episodes, 10))}
                                                {anime.episodes > 10 && '...'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">📊 Status</span>
                                    <span className={`meta-value status-${anime.status?.toLowerCase().replace(' ', '-')}`}>
                                        {anime.status}
                                    </span>
                                    <div className="status-indicator"></div>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">📅 Year</span>
                                    <span className="meta-value">{anime.year ?? "N/A"}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">⏱️ Duration</span>
                                    <span className="meta-value">{anime.duration ?? "N/A"}</span>
                                </div>
                                {anime.score && (
                                    <div className="meta-item highlight">
                                        <span className="meta-label">🏆 Rating</span>
                                        <div className="score-display">
                                            <span className="meta-value">{anime.score}/10</span>
                                            <div className="score-bar">
                                                <div 
                                                    className="score-fill" 
                                                    style={{width: `${(anime.score / 10) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {anime.popularity && (
                                    <div className="meta-item">
                                        <span className="meta-label">🔥 Popularity</span>
                                        <span className="meta-value">#{anime.popularity}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {anime.genres && (
                            <div className="genres-container">
                                <h3 className="genres-title">Genres</h3>
                                <div className="genres-list">
                                    {anime.genres.map((genre, index) => (
                                        <span key={index} className="genre-tag">
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="anime-actions">
                            <button 
                                className="share-btn"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: anime.title,
                                            text: `Check out ${anime.title} on AnimeVerse!`,
                                            url: window.location.href
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }
                                }}
                            >
                                <span className="share-icon">📤</span>
                                Share
                            </button>

                            {/* WATCHLIST BUTTON */}
{/* 
                            {watchlistLoading ? (
                                <button disabled className="favorite-btn">
                                    ⏳ Loading...
                                </button>
                            ) : currentWatchItem ? (
                                <button
                                    className="favorite-btn"
                                    onClick={() => handleRemoveFromWatchlist(currentWatchItem.id)}
                                    disabled={watchlistActionLoading}
                                >
                                    ❌ Remove from Watchlist ({currentWatchItem.status})
                                </button>
                            ) : (
                                <button
                                    className="favorite-btn"
                                    onClick={() => handleAddToWatchlist("PW")}
                                    disabled={watchlistActionLoading}
                                >
                                    ❤️ Add to Watchlist
                                </button> */}
                            {/* )} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis Section */}
            <section className="synopsis-section">
                <div className="section-container">
                    <h2 className="section-title">
                        <span className="section-icon">📖</span>
                        Synopsis
                    </h2>
                    <div className="synopsis-content">
                        <p className="synopsis-text">
                            {anime.synopsis || "No synopsis available for this anime."}
                        </p>
                    </div>
                </div>
            </section>
            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="section-container">
                    <h2 className="section-title">
                        <span className="section-icon">💬</span>
                        User Reviews
                    </h2>
                    
                    <div className="reviews-content">
                        {loadingReview ? (
                            <div className="reviews-loading">
                                <div className="mini-spinner"></div>
                                <p>Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="no-reviews">
                                <div className="no-reviews-icon">💭</div>
                                <h3>No reviews yet</h3>
                                <p>Be the first one to <a href="#review-form" className="review-link">write a review</a>!</p>
                            </div>
                        ) : (
                            <div className="reviews-grid">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-card">
                                        <div className="review-header">
                                            <div className="reviewer-info">
                                                <span className="reviewer-avatar">👤</span>
                                                <span className="reviewer-name">
                                                    {rev.user?.username || "Anonymous User"}
                                                </span>
                                            </div>
                                            <div className="review-rating">
                                                <span className="rating-stars">
                                                    {'⭐'.repeat(Math.floor(rev.rating / 2))}
                                                </span>
                                                <span className="rating-number">{rev.rating}/10</span>
                                            </div>
                                        </div>
                                        <div className="review-body">
                                            <p className="review-text">{rev.text || "No written review."}</p>
                                        </div>
                                        <div className="review-footer">
                                            <div className="review-actions">
                                                <button className="helpful-btn">
                                                    <span className="helpful-icon">👍</span>
                                                    <span>Helpful</span>
                                                </button>
                                            </div>
                                            <span className="review-date">
                                                {new Date(rev.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            {/* Review Form Section */}
            <section id="review-form" className="review-form-section">
                <div className="section-container">
                    {isAuthenticated ? (
                        <div className="review-form-container">
                            <h2 className="section-title">
                                <span className="section-icon">✍️</span>
                                Write Your Review
                            </h2>
                            <form onSubmit={handleReviewSubmit} className="review-form">
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">⭐</span>
                                        Rating (1-10)
                                    </label>
                                    <div className="rating-input-container">
                                        <input
                                            type="number" 
                                            name="ratings" 
                                            min="1" 
                                            max="10" 
                                            value={reviewForm.ratings} 
                                            onChange={handleReviewChange} 
                                            className="rating-input"
                                            placeholder="Rate this anime"
                                            required
                                        />
                                        <span className="rating-display">
                                            {'⭐'.repeat(Math.floor((reviewForm.ratings || 0) / 2))}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📝</span>
                                        Your Review
                                    </label>
                                    <textarea 
                                        name="text" 
                                        rows="6"
                                        value={reviewForm.text}
                                        onChange={handleReviewChange}
                                        className="review-textarea"
                                        placeholder="Share your thoughts about this anime..."
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submittingReview}
                                    className="submit-review-btn"
                                >
                                    {submittingReview ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🚀</span>
                                            Submit Review
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="login-prompt">
                            <div className="login-prompt-content">
                                <div className="login-icon">🔐</div>
                                <h3 className="login-title">Join the Community</h3>
                                <p className="login-message">
                                    You need to login to share your thoughts and write reviews.
                                </p>
                                <div className="login-actions">
                                    <a href="/login" className="login-btn">Login</a>
                                    <a href="/register" className="register-btn">Sign Up</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Scroll to Top Button */}
            <button 
                className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </div>
    );
}

export default AnimeDetailedPage;