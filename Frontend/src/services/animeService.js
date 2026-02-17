import api from "./api";
import publicApi from "./publicApi";

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

export async function getAnimeCharacters(animeId) {
  const res = await publicApi.get(`/anime/${animeId}/characters/`);
  return res.data.data || [];
}

export async function getAnimeStaff(animeId) {
  const res = await publicApi.get(`/anime/${animeId}/staff/`);
  return res.data.data || [];
}

export async function getAnimeRecommendations(animeId) {
  const res = await publicApi.get(`/anime/${animeId}/recommendations/`);
  return res.data.data || [];
}
