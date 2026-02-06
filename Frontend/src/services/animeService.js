import api from './api';

export async function searchAnime(query) {
    const res = await api.get("/anime/search/", {params : {q : query},
    });
    return res.data.data || [];
}

export async function getAnimeDetails(animeId) {
    const res = await api.get(`/anime/${animeId}/`);
    return res.data.data;
}

export async function getAnimeReviews(animeId) {
    const res = await api.get("/reviews/", {params : {anime_id :animeId},
    });
    return res.data.results || [];
}

export async function createReview(animeId, rating, comment) {
    const res = await api.post("/reviews/", {
        anime_id : animeId,
        rating,
        comment,
    });
    return res.data;
}

export async function deleteReview(reviewId) {
    await api.delete(`/reviews/${reviewId}/`);
}
