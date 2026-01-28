import api from "./api";

export async function fetchWatchlist() {
    const res = await api.get("/watchlist/");
    return res.data || [];
}

export async function addToWatchlist(animeId, status = "PW") {
    const res = await api.post("/watchlist/", { anime_id: animeId, status });
    return res.data;
}

export async function removeFromWatchlist(animeId) {
    const res = await api.delete(`/watchlist/${animeId}/`);
    return res.data;
}

export function findWatchlistItem(watchlist, animeId) {
    return watchlist?.find(item => Number(item.anime_id) === Number(animeId));
}

export async function updateWatchlistItem(itemId, data) {
  const res = await api.patch(`/watchlist/${itemId}/`, data);
  return res.data;
}hell