import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const wl = await fetchWatchlist();
        setWatchlist(Array.isArray(wl) ? wl : (wl.results || []));
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(id);
      setWatchlist(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user?.username}</p>

      <section>
        <h3>Your Watchlist</h3>
        {loading ? <p>Loading...</p> : (
          watchlist.length === 0 ? <p>No items in watchlist.</p> :
          <ul>
            {watchlist.map(item => (
              <li key={item.id}>
                <Link to={`/anime/${item.anime_id}`}>Anime ID: {item.anime_id}</Link>
                <span>Status: {item.status}</span>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
