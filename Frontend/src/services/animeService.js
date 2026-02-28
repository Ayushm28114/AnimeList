import api from "./api";
import publicApi from "./publicApi";

/**
 * Helper function to execute API call with retry logic for rate limiting
 * @param {Function} requestFn - Function that returns the axios promise
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise} - Resolves with the API response
 */
async function withRetry(requestFn, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      const isRateLimited = 
        error.response?.status === 429 ||
        error.message?.toLowerCase().includes('rate') ||
        error.response?.data?.message?.toLowerCase()?.includes('rate') ||
        error.response?.data?.error?.toLowerCase()?.includes('rate');
      
      if (isRateLimited && attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const backoffDelay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Rate limited on attempt ${attempt}, retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      
      // For non-rate-limit errors or final attempt, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}

export async function searchAnime(query) {
  const res = await publicApi.get("/anime/search/", {
    params: { q: query },
  });
  return res.data.data || [];
}

// Get search suggestions (lightweight, limited results)
export async function getSearchSuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  const res = await publicApi.get("/anime/search/", {
    params: { q: query, limit: 8 },
  });
  const data = res.data.data || [];
  // Return simplified suggestion objects
  return data.slice(0, 8).map(anime => ({
    mal_id: anime.mal_id,
    title: anime.title,
    image: anime.images?.jpg?.small_image_url || anime.images?.jpg?.image_url || '',
    type: anime.type || 'Anime',
    year: anime.year || ''
  }));
}

export async function getAnimeDetails(animeId) {
  const res = await publicApi.get(`/anime/${animeId}/`);
  return res.data.data;
}

export async function getAnimeReviews(animeId) {
  const res = await publicApi.get("/reviews/", {
    params: { anime_id: animeId },
  });
  return res.data.results || [];
}

export async function createReview(animeId, rating, comment) {
  const res = await api.post("/reviews/", {
    anime_id: animeId,
    rating,
    comment,
  });
  return res.data;
}

export async function deleteReview(reviewId) {
  const res = await api.delete(`/reviews/${reviewId}/`);
  return res.data;
}

export async function updateReview(reviewId, rating, comment) {
  const res = await api.patch(`/reviews/${reviewId}/`, {
    rating,
    comment,
  });
  return res.data;
}

export async function getAnimeCharacters(animeId) {
  return withRetry(async () => {
    const res = await publicApi.get(`/anime/${animeId}/characters/`);
    return res.data.data || [];
  });
}

export async function getAnimeStaff(animeId) {
  return withRetry(async () => {
    const res = await publicApi.get(`/anime/${animeId}/staff/`);
    return res.data.data || [];
  });
}

export async function getAnimeRecommendations(animeId) {
  return withRetry(async () => {
    const res = await publicApi.get(`/anime/${animeId}/recommendations/`);
    return res.data.data || [];
  });
}

export async function getAnimeRelations(animeId) {
  return withRetry(async () => {
    const res = await publicApi.get(`/anime/${animeId}/relations/`);
    return res.data.data || [];
  });
}

export async function getAnimeStatistics(animeId) {
  return withRetry(async () => {
    const res = await publicApi.get(`/anime/${animeId}/statistics/`);
    return res.data.data || {};
  });
}
