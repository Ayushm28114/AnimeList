import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAnimeReviews, createReview, deleteReview, updateReview } from '../../services/animeService';
import styles from './AnimeDetailPage.module.css';

export default function ReviewsSection({ animeId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  // Edit state
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editHoverRating, setEditHoverRating] = useState(0);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnimeReviews(animeId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Submit a new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await createReview(animeId, rating, comment);
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error('Failed to create review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a review
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(reviewId);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  // Start editing a review
  const handleEditStart = (review) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingReview(null);
    setEditRating(5);
    setEditComment('');
    setEditHoverRating(0);
  };

  // Save edited review
  const handleEditSave = async (reviewId) => {
    if (!editComment.trim()) return;

    setSubmitting(true);
    try {
      await updateReview(reviewId, editRating, editComment);
      setEditingReview(null);
      setEditRating(5);
      setEditComment('');
      setEditHoverRating(0);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      console.error('Failed to update review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating input
  const renderStarInput = (currentRating, currentHover, onRate, onHover, onLeave) => {
    return (
      <div className={styles.starInput}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.starBtn} ${star <= (currentHover || currentRating) ? styles.active : ''}`}
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onLeave()}
          >
            ★
          </button>
        ))}
        <span className={styles.ratingValue}>{currentHover || currentRating}/10</span>
      </div>
    );
  };

  // Render star display
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const stars = [];
    for (let i = 0; i < 10; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>💬</div>
        <h2 className={styles.sectionTitle}>Reviews ({reviews.length})</h2>
      </div>

      {/* Review Form - show for all authenticated users */}
      {isAuthenticated && (
        <form className={styles.reviewForm} onSubmit={handleSubmit}>
          <h3 className={styles.reviewFormTitle}>Write a Review</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Rating</label>
            {renderStarInput(rating, hoverRating, setRating, setHoverRating, () => setHoverRating(0))}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Review</label>
            <textarea
              className={styles.reviewTextarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this anime..."
              rows={4}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={submitting || !comment.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Login prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className={styles.loginPrompt}>
          <p>Please log in to write a review.</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.reviewsLoading}>
          <div className={styles.skeleton} style={{ height: '100px', marginBottom: '16px' }} />
          <div className={styles.skeleton} style={{ height: '100px', marginBottom: '16px' }} />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className={styles.reviewsError}>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={fetchReviews}>Try Again</button>
        </div>
      )}

      {/* Reviews list */}
      {!loading && !error && (
        <div className={styles.reviewsList}>
          {reviews.length === 0 ? (
            <div className={styles.noReviews}>
              <p>No reviews yet. Be the first to review this anime!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                {editingReview === review.id ? (
                  /* Edit Mode */
                  <div className={styles.editReviewForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Update Rating</label>
                      {renderStarInput(editRating, editHoverRating, setEditRating, setEditHoverRating, () => setEditHoverRating(0))}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Update Review</label>
                      <textarea
                        className={styles.reviewTextarea}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        placeholder="Update your review..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className={styles.editActions}>
                      <button 
                        type="button" 
                        className={styles.submitBtn}
                        onClick={() => handleEditSave(review.id)}
                        disabled={submitting || !editComment.trim()}
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewUser}>
                        <div className={styles.userAvatar}>
                          {review.user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{review.user?.username || 'Anonymous'}</span>
                          <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        <span className={styles.reviewStars}>{renderStars(review.rating)}</span>
                        <span className={styles.reviewScore}>{review.rating}/10</span>
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                    
                    {/* Edit and Delete buttons for user's own review */}
                    {user?.username === review.user?.username && (
                      <div className={styles.reviewActions}>
                        <button 
                          className={styles.editReviewBtn}
                          onClick={() => handleEditStart(review)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className={styles.deleteReviewBtn}
                          onClick={() => handleDelete(review.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
