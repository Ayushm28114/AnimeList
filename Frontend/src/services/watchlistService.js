// Watchlist service for anime tracking

import api from "./api";
import publicApi from "./publicApi";

export async function fetchWatchlist() {
    const res = await api.get("/watchlist/");
    // Handle both paginated response {results: [...]} and plain array [...]
    const data = res.data?.results || res.data || [];
    return Array.isArray(data) ? data : [];
}

export async function addToWatchlist(animeId, status = "PW", animeTitle = "", animeImage = "") {
    const res = await api.post("/watchlist/", { 
        anime_id: animeId, 
        status,
        anime_title: animeTitle,
        anime_image: animeImage
    });
    return res.data;
}

export async function removeFromWatchlist(animeId) {
    // First get the watchlist to find the item id
    const watchlist = await fetchWatchlist();
    const item = watchlist.find(w => w.anime_id === Number(animeId));
    if (item) {
        const res = await api.delete(`/watchlist/${item.id}/`);
        return res.data;
    }
    throw new Error("Item not found in watchlist");
}

export function findWatchlistItem(watchlist, animeId) {
    return watchlist?.find(item => item.anime_id === Number(animeId));
}

export async function updateWatchlistItem(itemId, data) {
    const res = await api.patch(`/watchlist/${itemId}/`, data);
    return res.data;
}

export async function toggleFavorite(itemId, isFavorite) {
    const res = await api.patch(`/watchlist/${itemId}/`, { is_favorite: isFavorite });
    return res.data;
}

// ==================== SHARING FEATURES ====================

export async function getSharingSettings() {
    const res = await api.get("/watchlist/sharing/");
    return res.data;
}

export async function updateSharingSettings(isPublic) {
    const res = await api.post("/watchlist/sharing/", { is_public: isPublic });
    return res.data;
}

export async function regenerateShareCode() {
    const res = await api.post("/watchlist/regenerate-code/");
    return res.data;
}

export async function getSharedWatchlist(shareCode) {
    const res = await publicApi.get(`/shared/${shareCode}/`);
    return res.data;
}