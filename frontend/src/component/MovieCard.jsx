import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StarIcon } from "lucide-react";
import isoTimeFormat from "../lib/timeFormat";
import ForMissingImage from "/ForMissingImage.png";
import { useSearch } from "../context/SearchContext";

export default function MovieCard() {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/movies`);
        setAllMovies(data?.movies || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/movies/${id}`);
    window.scrollTo(0, 0);
  };

  const filteredMovies = useMemo(() => {
    return query
      ? allMovies.filter((movie) =>
          movie.title?.toLowerCase().includes(query.toLowerCase())
        )
      : allMovies;
  }, [query, allMovies]);

  if (loading)
    return <div className="text-center py-10 text-gray-600">Loading movies...</div>;

  if (filteredMovies.length === 0)
    return <div className="text-center py-10 text-gray-600">No movies found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {filteredMovies.slice(0, 4).map((item) => {
        const imageSrc = item.bannerUrl
          ? `https://image.tmdb.org/t/p/w500${item.bannerUrl}`
          : item.posterUrl
          ? `https://image.tmdb.org/t/p/w500${item.posterUrl}`
          : item.backdrop_Path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_Path}`
          : ForMissingImage;

        const key = item._id ?? `${item.title}-${item.releaseDate}`;

        return (
          <div
            key={key}
            className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden p-4"
          >
            <img
              onClick={() => handleNavigate(item._id)}
              src={imageSrc}
              alt={item.title || "Untitled Movie"}
              className="rounded-md mb-4 h-52 w-full object-cover object-right-bottom cursor-pointer"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {item.title || "Untitled Movie"}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              {item.releaseDate
                ? new Date(item.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Release Date N/A"}
              {" | "}
              {item.genre?.slice(0, 2).join(", ") || "Genre Unknown"}
              {" | "}
              {item.runtime ? isoTimeFormat(item.runtime) : "Duration Unknown"}
            </p>
            <div className="mt-3">
              <button
                onClick={() => handleNavigate(item._id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
              <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {item.rating ? item.rating.toFixed(1) : "N/A"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
