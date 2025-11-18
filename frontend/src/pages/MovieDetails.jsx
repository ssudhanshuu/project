import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import ForMissingImage from "/ForMissingImage.png";
// import useAppContext from "../context/useAppContext"
import { useSearch } from "../context/SearchContext";
import axios from "axios";

export default function MovieDetails() {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();

  const API_URL = import.meta.env.VITE_API_URL || "https://project-1-ahno.onrender.com";

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

  const filteredMovies = query
    ? allMovies.filter((movie) =>
        movie.title?.toLowerCase().includes(query.toLowerCase())
      )
    : allMovies;

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading movies...</div>;
  }

  return (
    <div className="grid grid-cols-1 ml-20 mr-20 mb-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {filteredMovies.map((item) => {
        const imageSrc = item.bannerUrl
          ? `https://image.tmdb.org/t/p/w500${item.bannerUrl}`
          : item.posterUrl
          ? `https://image.tmdb.org/t/p/w500${item.posterUrl}`
          : item.backdrop_Path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_Path}`
          : ForMissingImage;

        return (
          <div
            key={item._id || item.id}
            className="min-w-[250px] bg-white rounded-xl shadow-md overflow-hidden p-4"
          >
            <img
              onClick={() => {
                navigate(`/movies/${item._id || item.id}`);
                window.scrollTo(0, 0);
              }}
              src={imageSrc}
              alt={item.title || "Untitled Movie"}
              className="rounded-md mb-4 h-52 w-full object-cover object-right-bottom cursor-pointer"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              {item.title || "Untitled"}
            </h2>

            <p className="text-gray-600 mt-2 text-sm">
              {item.releaseDate
                ? new Date(item.releaseDate).toLocaleDateString()
                : "Release Date N/A"}{" "}
              | {item.genre?.slice(0, 2).map((g) => g.name).join(" | ") || "Genres Unknown"} |{" "}
              {item.runtime ? timeFormat(item.runtime) : "Duration Unknown"}
            </p>

            <div>
              <button
                onClick={() => {
                  navigate(`/movies/${item._id || item.id}`);
                  window.scrollTo(0, 0);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Buy Ticket
              </button>

              <p className="flex items-center gap-1 text-sm text-gray-500 mt-1 pr-1">
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
