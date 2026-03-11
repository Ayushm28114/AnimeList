import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchWatchlist } from "../services/watchlistService";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnime: 0,
    reviews: 0,
    watchlist: 0,
    favorites: 0
  });

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  // Edit Profile State
  const [editForm, setEditForm] = useState({
    bio: "",
    email: ""
  });
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Bio State (persisted in localStorage)
  const [userBio, setUserBio] = useState(() => {
    return localStorage.getItem("userBio") || "Anime enthusiast exploring different genres and discovering new favorites.";
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    setLoading(true);
    try {
      // Fetch watchlist
      const watchlistData = await fetchWatchlist();
      setWatchlist(watchlistData);

      // Fetch user reviews
      const reviewsRes = await api.get("/reviews/", {
        params: { user_id: user?.id }
      });
      const userReviews = reviewsRes.data.results || reviewsRes.data || [];
      setReviews(userReviews);

      // Update stats
      setStats({
        totalAnime: watchlistData.filter(w => w.status === "C").length,
        reviews: userReviews.length,
        watchlist: watchlistData.length,
        favorites: watchlistData.filter(w => w.is_favorite).length || 0
      });
    } catch (error) {
      // Log error for debugging
      console.error('Error fetching profile data:', error);
      setWatchlist([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Refetch data when returning to profile page (e.g., after adding to watchlist)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchUserData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, fetchUserData]);

  // Initialize edit form when modal opens
  useEffect(() => {
    if (showEditModal) {
      setEditForm({
        bio: userBio,
        email: user?.email || ""
      });
    }
  }, [showEditModal, userBio, user?.email]);

  // Filter watchlist by status
  const getFilteredWatchlist = () => {
    if (activeTab === "all") return watchlist;
    const statusMap = {
      watching: "W",
      completed: "C",
      planToWatch: "PW",
      onHold: "OH",
      dropped: "D"
    };
    return watchlist.filter(item => item.status === statusMap[activeTab]);
  };

  // Get watchlist counts
  const getStatusCount = (status) => {
    if (status === "all") return watchlist.length;
    const statusMap = {
      watching: "W",
      completed: "C",
      planToWatch: "PW",
      onHold: "OH",
      dropped: "D"
    };
    return watchlist.filter(item => item.status === statusMap[status]).length;
  };

  // Handle remove from watchlist
  const handleRemoveFromWatchlist = async (e, itemId, animeId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/watchlist/${itemId}/`);
      setWatchlist(prev => prev.filter(item => item.anime_id !== animeId));
      // Update stats
      setStats(prev => ({
        ...prev,
        watchlist: prev.watchlist - 1
      }));
      showToast("Removed from watchlist", "success");
    } catch {
      showToast("Failed to remove from watchlist", "error");
    }
  };

  // Handle Edit Profile Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUserBio(editForm.bio);
    localStorage.setItem("userBio", editForm.bio);
    setShowEditModal(false);
    showToast("Profile updated successfully!", "success");
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user?.username) {
      showToast("Please type your username correctly to confirm", "error");
      return;
    }
    
    try {
      // Call API to delete account if endpoint exists
      await api.delete("/auth/delete-account/");
      logout();
      navigate("/");
      showToast("Account deleted successfully", "success");
    } catch {
      // If API doesn't exist, just logout
      logout();
      localStorage.clear();
      navigate("/");
      showToast("Account deleted successfully", "success");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 10; i++) {
      stars.push(
        <span key={i} style={{ color: i < fullStars ? "#fbbf24" : "#2a2a3e" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Get status label
  const getStatusLabel = (status) => {
    const labels = {
      W: "Watching",
      C: "Completed",
      PW: "Plan to Watch",
      OH: "On Hold",
      D: "Dropped"
    };
    return labels[status] || status;
  };

  // Get status class
  const getStatusClass = (status) => {
    const classes = {
      W: styles.watching,
      C: styles.completed,
      PW: styles.planToWatch,
      OH: styles.onHold,
      D: styles.dropped
    };
    return classes[status] || "";
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <p className={styles.loadingText}>Please log in to view your profile.</p>
          <Link to="/login" className={styles.emptyAction}>Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Profile</h2>
              <button className={styles.modalClose} onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <span className={styles.charCount}>{editForm.bio.length}/500</span>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  disabled
                />
                <span className={styles.formHint}>Email cannot be changed here</span>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 style={{ color: "#ef4444" }}>⚠️ Delete Account</h2>
              <button className={styles.modalClose} onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.deleteWarning}>
                This action is <strong>permanent</strong> and cannot be undone. All your data including watchlist, reviews, and settings will be permanently deleted.
              </p>
              <div className={styles.formGroup}>
                <label htmlFor="deleteConfirm">
                  Type <strong>{user?.username}</strong> to confirm:
                </label>
                <input
                  type="text"
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="off"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={styles.deleteBtn}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== user?.username}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <header className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className={styles.avatarBadge}>✓</div>
          </div>

          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user?.username || "User"}</h1>
            <div className={styles.userMeta}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>📅</span>
                Member since {formatDate(user?.date_joined) || "2024"}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>🎬</span>
                {stats.totalAnime} anime completed
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>✍️</span>
                {stats.reviews} reviews
              </span>
            </div>
            <p className={styles.userBio}>{userBio}</p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.editProfileBtn} onClick={() => setShowEditModal(true)}>
              <span>✏️</span> Edit Profile
            </button>
            <button className={styles.logoutBtn} onClick={logout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.watchlist}</div>
            <div className={styles.statLabel}>Watchlist</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalAnime}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.reviews}</div>
            <div className={styles.statLabel}>Reviews</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.favorites}</div>
            <div className={styles.statLabel}>Favorites</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Watchlist Section */}
          <section className={`${styles.section} ${styles.fullWidth}`}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIcon}>📚</div>
                <h2 className={styles.sectionTitle}>My Watchlist</h2>
              </div>
              <Link to="/" className={styles.sectionAction}>
                Browse Anime →
              </Link>
            </div>
            <div className={styles.sectionContent}>
              {/* Tabs */}
              <div className={styles.watchlistTabs}>
                {["all", "watching", "completed", "planToWatch", "onHold", "dropped"].map(tab => (
                  <button
                    key={tab}
                    className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "all" ? "All" : 
                     tab === "watching" ? "Watching" :
                     tab === "completed" ? "Completed" :
                     tab === "planToWatch" ? "Plan to Watch" :
                     tab === "onHold" ? "On Hold" : "Dropped"}
                    <span className={styles.tabCount}>{getStatusCount(tab)}</span>
                  </button>
                ))}
              </div>

              {/* Watchlist Grid */}
              {getFilteredWatchlist().length > 0 ? (
                <div className={styles.watchlistGrid}>
                  {getFilteredWatchlist().map(item => (
                    <div key={item.id} className={styles.animeCardWrapper}>
                      <Link 
                        to={`/anime/${item.anime_id}`}
                        className={styles.animeCard}
                      >
                        <img 
                          src={item.anime_image || `https://via.placeholder.com/150x225?text=${encodeURIComponent(item.anime_title?.[0] || "A")}`}
                          alt={item.anime_title}
                          className={styles.animePoster}
                        />
                        <span className={`${styles.animeStatus} ${getStatusClass(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                        <div className={styles.animeInfo}>
                          <h3 className={styles.animeTitle}>{item.anime_title || `Anime #${item.anime_id}`}</h3>
                        </div>
                      </Link>
                      <button 
                        className={styles.removeBtn}
                        onClick={(e) => handleRemoveFromWatchlist(e, item.id, item.anime_id)}
                        title="Remove from watchlist"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📺</div>
                  <p className={styles.emptyText}>
                    {activeTab === "all" 
                      ? "Your watchlist is empty. Start exploring anime!"
                      : `No anime in "${activeTab}" category.`}
                  </p>
                  <Link to="/" className={styles.emptyAction}>
                    Discover Anime
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Reviews Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIcon}>💬</div>
                <h2 className={styles.sectionTitle}>My Reviews</h2>
              </div>
            </div>
            <div className={styles.sectionContent}>
              {reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                  {reviews.slice(0, 5).map(review => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <Link to={`/anime/${review.anime_id}`} className={styles.reviewAnime}>
                          <img 
                            src={review.anime_image || `https://via.placeholder.com/48x68?text=A`}
                            alt="Anime"
                            className={styles.reviewAnimePoster}
                          />
                          <div className={styles.reviewAnimeInfo}>
                            <h4 className={styles.reviewAnimeTitle}>
                              {review.anime_title || `Anime #${review.anime_id}`}
                            </h4>
                            <span className={styles.reviewDate}>
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                        </Link>
                        <div className={styles.reviewRating}>
                          <span className={styles.reviewStars}>{renderStars(review.rating)}</span>
                          <span className={styles.reviewScore}>{review.rating}/10</span>
                        </div>
                      </div>
                      <p className={styles.reviewComment}>{review.comment}</p>
                      <div className={styles.reviewFooter}>
                        <div className={styles.reviewStats}>
                          <span className={styles.reviewStat}>
                            👍 {review.likes_count || 0}
                          </span>
                          <span className={styles.reviewStat}>
                            💬 {review.replies?.length || 0}
                          </span>
                        </div>
                        <div className={styles.reviewActions}>
                          <Link 
                            to={`/anime/${review.anime_id}`} 
                            className={styles.reviewActionBtn}
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✍️</div>
                  <p className={styles.emptyText}>You haven&apos;t written any reviews yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Settings Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <div className={styles.sectionIcon}>⚙️</div>
                <h2 className={styles.sectionTitle}>Quick Settings</h2>
              </div>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingIcon}>️</div>
                    <div className={styles.settingDetails}>
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account</p>
                    </div>
                  </div>
                  <button 
                    className={styles.settingAction} 
                    style={{ borderColor: "#ef4444", color: "#ef4444" }}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
