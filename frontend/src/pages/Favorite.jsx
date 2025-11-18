// Favorite.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import MovieCard from "../component/MovieCard";

export default function Favorite() {
  const { getToken, isSignedIn } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchFavorites() {
      if (!isSignedIn) return;

      try {
        // 🔑 Use your JWT template name here
        const token = await getToken({ template: "my-backend" });
        console.log("JWT for API:", token);

        const res = await fetch(`${API_URL}/api/user/favorites/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${body}`);
        }

        const { favorites } = await res.json();
        setFavorites(favorites);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    }

    fetchFavorites();
  }, [isSignedIn, getToken, API_URL]);

  return (
    <div className="px-6 md:px-16 lg:px-40 mt-10">
      <h2 className="text-2xl font-semibold mb-4">My Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.length
          ? favorites.map((m) => <MovieCard key={m._id} movie={m} />)
          : <p className="text-gray-500">No favorites added yet.</p>}
      </div>
    </div>
  );
}
