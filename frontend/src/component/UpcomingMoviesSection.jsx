import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StarIcon, CalendarIcon, ChevronRight } from "lucide-react";
import { API_URL } from "../lib/apiConfig";

// API_URL imported from apiConfig

export default function UpcomingMoviesSection() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/movies/upcoming`);
        setMovies(data?.movies?.slice(0, 8) || []);
      } catch (err) {
        console.error("Error fetching upcoming movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-300">Upcoming Movies</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-xl h-64 mb-3"></div>
              <div className="bg-gray-700 h-4 rounded mb-2 w-3/4"></div>
              <div className="bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="px-6 md:px-16 lg:px-24 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-300">Upcoming Movies</h2>
        </div>
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {movies.map((movie) => {
          const poster = movie.posterUrl
            ? movie.posterUrl
            : movie.poster_Path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_Path}`
            : null;

          const releaseDate = movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "TBA";

          return (
            <div
              key={movie.tmdbId}
              onClick={() => {
                navigate(`/movies/${movie.tmdbId}`);
                window.scrollTo(0, 0);
              }}
              className="group relative bg-gray-800/60 rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-amber-500/40"
            >
              {/* Poster */}
              <div className="relative overflow-hidden">
                {poster ? (
                  <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Poster</span>
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                {/* Rating badge */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white font-medium">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Coming Soon badge */}
                <div className="absolute top-2 left-2 bg-amber-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  Coming Soon
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate mb-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{releaseDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
