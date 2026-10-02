import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import {
  FilmIcon,
  BuildingIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import Title from "./Title";
import { API_URL } from "../../../lib/apiConfig";

// API_URL imported from apiConfig

export default function AssignMovieToTheater() {
  const { getToken } = useAuth();
  const [theaters, setTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [movieSearch, setMovieSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingAll, setFetchingAll] = useState(true);

  // ── fetch theaters, movies, assignments ──────────────────────────────────
  const fetchAll = async () => {
    try {
      setFetchingAll(true);
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [theatersRes, moviesRes, assignmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/theaters`),
        axios.get(`${API_URL}/api/movies`),
        axios.get(`${API_URL}/api/theater-movies/assignments/all`, { headers }),
      ]);

      setTheaters(theatersRes.data || []);
      setMovies(moviesRes.data?.movies || []);
      setAssignments(assignmentsRes.data?.assignments || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load data");
    } finally {
      setFetchingAll(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Assign movie to theater ───────────────────────────────────────────────
  const handleAssign = async () => {
    if (!selectedTheater || !selectedMovie) {
      toast.error("Please select both a theater and a movie");
      return;
    }

    // Check if already assigned
    const alreadyAssigned = assignments.some(
      (a) =>
        a.theater?._id === selectedTheater && a.movie?._id === selectedMovie
    );
    if (alreadyAssigned) {
      toast.error("This movie is already assigned to this theater");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const res = await axios.post(
        `${API_URL}/api/theater-movies/assign`,
        { theaterId: selectedTheater, movieId: selectedMovie },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Movie assigned successfully!");
      setSelectedMovie("");
      await fetchAll();
    } catch (err) {
      console.error("Assign error:", err);
      const msg = err.response?.data?.message || "Failed to assign movie";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Remove assignment ─────────────────────────────────────────────────────
  const handleRemove = async (theaterId, movieId) => {
    try {
      const token = await getToken();
      await axios.delete(
        `${API_URL}/api/theater-movies/${theaterId}/movies/${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Movie removed from theater");
      await fetchAll();
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove movie");
    }
  };

  // ── Filter movies by search ───────────────────────────────────────────────
  const filteredMovies = movies.filter((m) =>
    m.title?.toLowerCase().includes(movieSearch.toLowerCase())
  );

  // ── Group assignments by theater ─────────────────────────────────────────
  const assignmentsByTheater = theaters.map((theater) => ({
    theater,
    movies: assignments
      .filter((a) => a.theater?._id === theater._id)
      .map((a) => a.movie),
  }));

  if (fetchingAll) {
    return (
      <div className="flex min-h-screen mt-15 bg-black text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
        <Title text1="Admin" text2="Assign Movies to Theaters" />

        {/* ── Assignment Form ─────────────────────────────────────────────── */}
        <div className="mt-6 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusIcon className="w-5 h-5 text-indigo-400" />
            Assign a Movie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Theater Select */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Theater
              </label>
              <select
                value={selectedTheater}
                onChange={(e) => setSelectedTheater(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Select Theater --</option>
                {theaters.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — {t.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Movie Select with search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Movie
              </label>
              <div className="relative mb-2">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none text-sm"
                />
              </div>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
                size={4}
              >
                <option value="">-- Select Movie --</option>
                {filteredMovies.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.title}{" "}
                    {m.releaseDate
                      ? `(${new Date(m.releaseDate).getFullYear()})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAssign}
            disabled={loading || !selectedTheater || !selectedMovie}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition font-medium"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <CheckCircleIcon className="w-5 h-5" />
            )}
            Assign Movie to Theater
          </button>
        </div>

        {/* ── Assignments Overview ────────────────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BuildingIcon className="w-5 h-5 text-indigo-400" />
            Theater Assignments Overview
          </h2>

          {assignmentsByTheater.every((t) => t.movies.length === 0) && (
            <p className="text-gray-500 text-sm">
              No movies assigned yet. Use the form above to assign movies.
            </p>
          )}

          <div className="space-y-6">
            {assignmentsByTheater.map(({ theater, movies: theaterMovies }) => (
              <div
                key={theater._id}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                    <BuildingIcon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{theater.name}</h3>
                    <p className="text-gray-400 text-xs">{theater.location}</p>
                  </div>
                  <span className="ml-auto bg-indigo-600/20 text-indigo-300 text-xs px-3 py-1 rounded-full">
                    {theaterMovies.length} movie{theaterMovies.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {theaterMovies.length === 0 ? (
                  <p className="text-gray-600 text-sm italic">
                    No movies assigned to this theater.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {theaterMovies.map((movie) => {
                      if (!movie) return null;
                      const poster = movie.poster_Path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_Path}`
                        : null;
                      return (
                        <div
                          key={movie._id}
                          className="relative group bg-gray-700 rounded-xl overflow-hidden"
                        >
                          {poster ? (
                            <img
                              src={poster}
                              alt={movie.title}
                              className="w-full h-28 object-cover"
                            />
                          ) : (
                            <div className="w-full h-28 flex items-center justify-center">
                              <FilmIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div className="p-2">
                            <p className="text-xs text-white truncate font-medium">
                              {movie.title}
                            </p>
                            {movie.vote_average > 0 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <StarIcon className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-400">
                                  {Number(movie.vote_average).toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemove(theater._id, movie._id)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            title="Remove"
                          >
                            <TrashIcon className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
