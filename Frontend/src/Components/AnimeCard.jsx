// This file contains AnimeCard component for dynamic search results
// Uses separate CSS classes to avoid conflicts with static posters



import './style.css';
import { Link } from 'react-router-dom';

function AnimeCard({anime = {}}) {
    const img = 
        anime.images?.jpg?.image_url || 
        anime.images?.webp?.image_url ||
        "";

    if (!anime.title) {
        return (
            <div className="search-card">
                <div className="search-card-details">
                    <p>No anime data available to show...😭</p>
                </div>
            </div>
        );            
    }

    return (
        <div className="search-card">
            {img && (
                <Link to={`/anime/${anime.mal_id}`}>
                    <img 
                        className="search-card-image"
                        src={img} 
                        alt={anime.title} 
                    />
                </Link>
            )}
            <Link className="search-card-title" to={`/anime/${anime.mal_id}`}>
                {anime.title}
            </Link>
            <div className="search-card-details">
                {anime.score && <p><strong>Score:</strong> {anime.score}/10</p>}
                {anime.year && <p><strong>Year:</strong> {anime.year}</p>}
                {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
                {anime.genres && anime.genres.length > 0 && (
                    <p><strong>Genre:</strong> {anime.genres.slice(0, 3).map(g => g.name).join(', ')}</p>
                )}
                {anime.episodes && <p><strong>Episodes:</strong> {anime.episodes}</p>}
                {anime.type && <p><strong>Type:</strong> {anime.type}</p>}
                {anime.aired && anime.aired.from && (
                    <p><strong>Start Date:</strong> {new Date(anime.aired.from).getFullYear()}</p>
                )}
                {anime.rating && <p><strong>Rating:</strong> {anime.rating}</p>}
            </div>
        </div>
    );
}

// Container component for multiple AnimeCards with flex layout
export function AnimeCardContainer({ animeList = [], title = "Search Results" }) {
    return (
        <>
            <h1 id="search-results-title">{title}</h1>
            <div id="search-results-container">
                {animeList.length > 0 ? (
                    animeList.map((anime) => (
                        <AnimeCard key={anime.mal_id || anime.id} anime={anime} />
                    ))
                ) : (
                    <div className="search-card">
                        <div className="search-card-details">
                            <p>No anime data available...😭</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AnimeCard;