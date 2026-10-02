import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapPinIcon,
  UsersIcon,
  FilmIcon,
  StarIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Theater Movies Modal / Detail Panel ─────────────────────────────────────
function TheaterMoviesPanel({ theater, onClose, navigate }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/theater-movies/${theater._id}/movies`
        );
        setMovies(data?.movies || []);
      } catch (err) {
        console.error("Error fetching theater movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [theater._id]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Theaters
            </button>
            <h2 className="text-2xl font-bold text-white">{theater.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-3.5 h-3.5" /> {theater.location}
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon className="w-3.5 h-3.5" /> {theater.totalSeats} seats
              </span>
            </div>
          </div>
          <FilmIcon className="w-10 h-10 text-indigo-400 opacity-60" />
        </div>

        {/* Movie List */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-700 rounded-xl h-52 mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-16">
              <FilmIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No movies assigned to this theater yet.</p>
              <p className="text-gray-600 text-sm mt-1">
                Admin will add movies soon.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">
                {movies.length} movie{movies.length !== 1 ? "s" : ""} showing at this theater
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movies.map((movie) => {
                  const poster = movie.poster_Path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_Path}`
                    : movie.bannerUrl || null;

                  return (
                    <div
                      key={movie._id}
                      onClick={() => {
                        navigate(`/movies/${movie._id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="group bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-gray-700 hover:border-indigo-500/50 shadow hover:shadow-indigo-500/20"
                    >
                      <div className="relative">
                        {poster ? (
                          <img
                            src={poster}
                            alt={movie.title}
                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-52 bg-gray-700 flex items-center justify-center">
                            <FilmIcon className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
                        {movie.vote_average > 0 && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                            <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-white">
                              {Number(movie.vote_average).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm truncate">{movie.title}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {movie.genre?.slice(0, 2).join(", ") || ""}
                        </p>
                        <button className="mt-2 w-full py-1.5 text-xs bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Theaters Page ───────────────────────────────────────────────────────
function Theaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheater, setSelectedTheater] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/theaters`);
        setTheaters(res.data);
      } catch (error) {
        console.error("Error fetching theaters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  const filteredTheaters = theaters.filter((theater) => {
    const name = theater.name || theater.theaterName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="max-w-5xl mt-24 mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-2xl h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Theater Movies Panel */}
      {selectedTheater && (
        <TheaterMoviesPanel
          theater={selectedTheater}
          onClose={() => setSelectedTheater(null)}
          navigate={navigate}
        />
      )}

      <div className="max-w-5xl mt-24 mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Available Theaters</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Browse theaters and see what's showing
        </p>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search theaters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {filteredTheaters.length === 0 ? (
          <p className="text-center text-gray-400">No theaters found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTheaters.map((theater) => (
              <div
                key={theater._id}
                className="group p-6 bg-gray-800/70 border border-gray-700 rounded-2xl shadow hover:shadow-indigo-500/20 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Theater Icon */}
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                  <FilmIcon className="w-6 h-6 text-indigo-400" />
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">
                  {theater.name || theater.theaterName}
                </h2>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{theater.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <UsersIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{theater.totalSeats} Total Seats</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTheater(theater)}
                  className="flex items-center gap-2 mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-sm font-medium w-full justify-center group-hover:gap-3"
                >
                  View Movies
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Theaters;
