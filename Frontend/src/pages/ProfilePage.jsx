import { useAuth } from "../context/AuthContext.jsx";
// import { fetchWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user?.username}</p>

    </div>
  );
}
