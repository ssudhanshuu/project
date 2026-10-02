import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StarIcon, ClockIcon, SearchIcon } from "lucide-react";
import { useSearch } from "../context/SearchContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function NowPlayingMovies() {
  const navigate = useNavigate();
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [dbMovies, setDbMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearch();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch both TMDB live now-playing AND our saved DB movies in parallel
        const [tmdbRes, dbRes] = await Promise.all([
          axios.get(`${API_URL}/api/movies/now-playing`),
          axios.get(`${API_URL}/api/movies`),
        ]);

        setTmdbMovies(tmdbRes.data?.movies || []);
        setDbMovies(dbRes.data?.movies || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Merge TMDB live list with DB records (DB records win since they have more data)
  const mergedMovies = useMemo(() => {
    const dbMap = new Map(dbMovies.map((m) => [m.tmdbId, m]));
    return tmdbMovies.map((tm) => {
      const db = dbMap.get(tm.tmdbId);
      return db ? { ...tm, ...db, _id: db._id } : tm;
    });
  }, [tmdbMovies, dbMovies]);

  const filteredMovies = useMemo(() => {
    if (!query) return mergedMovies;
    return mergedMovies.filter((m) =>
      m.title?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, mergedMovies]);

  const handleNavigate = (movie) => {
    if (movie._id) {
      navigate(`/movies/${movie._id}`);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-xl h-72 mb-3"></div>
              <div className="bg-gray-700 h-4 rounded mb-2 w-3/4"></div>
              <div className="bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p className="text-lg">No movies found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-300">
          Now Playing{" "}
          <span className="text-gray-500 text-base font-normal">
            ({filteredMovies.length} movies)
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filteredMovies.map((movie, idx) => {
          const poster = movie.poster_Path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_Path}`
            : movie.posterUrl || null;

          return (
            <div
              key={movie._id || movie.tmdbId || idx}
              onClick={() => handleNavigate(movie)}
              className={`group bg-gray-800/60 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 transition-all duration-300
                ${movie._id ? "hover:-translate-y-1 hover:shadow-blue-500/20 hover:border-blue-500/40 cursor-pointer" : "opacity-80 cursor-default"}`}
            >
              {/* Poster */}
              <div className="relative overflow-hidden">
                {poster ? (
                  <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Poster</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                {/* Rating */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white font-medium">
                      {Number(movie.vote_average).toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Now Playing badge */}
                <div className="absolute top-2 left-2 bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Now Playing
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm truncate mb-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      <span>{movie.runtime}m</span>
                    </div>
                  )}
                  {movie.genre?.length > 0 && (
                    <span className="truncate">
                      {Array.isArray(movie.genre)
                        ? movie.genre.slice(0, 2).join(", ")
                        : ""}
                    </span>
                  )}
                </div>
                {movie._id && (
                  <button className="mt-2 w-full py-1.5 text-xs bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition">
                    Book Tickets
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
