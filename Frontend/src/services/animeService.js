import api from "./api";
import publicApi from "./publicApi";

export async function searchAnime(query) {
  const res = await publicApi.get("/anime/search/", {
    params: { q: query },
  });
  return res.data.data || [];
}

export async function getAnimeDetails(id) {
  const res = await publicApi.get(`/anime/${id}/`);
  return res.data.data;
}

export async function getAnimeReviews(id) {
  const res = await publicApi.get("/reviews/", {
    params: { anime_id: id },
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

export async function deleteReview(id) {
  return api.delete(`/reviews/${id}/`);
}
