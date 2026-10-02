import React, { useEffect, useState, useMemo } from "react";
import Title from "./Title";
import axios from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import { StarIcon, SearchIcon, ClockIcon } from "lucide-react";
import { API_URL } from "../../../lib/apiConfig";

// API_URL imported from apiConfig

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [showInputs, setShowInputs] = useState([{ date: "", time: [{ id: Date.now(), value: "" }] }]);
  const [showPrice, setShowPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = () => {
    axios
      .get(`${API_URL}/api/movies`)
      .then((res) => {
        if (res.data.success) setMovies(res.data.movies);
      })
      .catch((err) => {
        console.error("Movies fetch error:", err);
        toast.error("Failed to fetch movies");
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSyncMovies = async () => {
    try {
      setLoading(true);
      toast.info("Syncing movies from TMDB...");
      await axios.get(`${API_URL}/api/movies/fetch`);
      toast.success("Movies synced successfully!");
      fetchMovies();
    } catch (err) {
      console.error("Sync error:", err);
      toast.error("Failed to sync movies from TMDB");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedMovie) {
      setShows([]);
      return;
    }

    axios
      .get(`${API_URL}/api/shows`, { params: { movieId: selectedMovie._id } })
      .then((res) => {
        const data = Array.isArray(res.data.shows) ? res.data.shows : Array.isArray(res.data) ? res.data : [];
        setShows(data);
      })
      .catch((err) => {
        console.error("Shows fetch error:", err);
      });
  }, [selectedMovie]);

  const handleInputChange = (idx, field, value) => {
    const copy = [...showInputs];
    copy[idx][field] = value;
    setShowInputs(copy);
  };

  const handleTimeChange = (idx, tIdx, value) => {
    const copy = [...showInputs];
    copy[idx].time[tIdx].value = value;
    setShowInputs(copy);
  };

  const handleAddTime = (idx) => {
    const copy = [...showInputs];
    copy[idx].time.push({ id: Date.now() + Math.random(), value: "" });
    setShowInputs(copy);
  };

  const handleAddDateInput = () => {
    setShowInputs((prev) => [...prev, { date: "", time: [{ id: Date.now(), value: "" }] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie || !showPrice || showInputs.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await Promise.all(
        showInputs.map(({ date, time }) =>
          axios.post(`${API_URL}/api/shows/add`, {
            movieId: selectedMovie._id,
            date,
            timeSlots: time.map((t) => t.value).filter(t => t),
            price: showPrice,
            isActive,
          })
        )
      );

      toast.success("Show(s) added successfully!");
      setShowPrice("");
      setIsActive(true);
      setShowInputs([{ date: "", time: [{ id: Date.now(), value: "" }] }]);

      // Refresh shows
      const res = await axios.get(`${API_URL}/api/shows`, { params: { movieId: selectedMovie._id } });
      const data = Array.isArray(res.data.shows) ? res.data.shows : Array.isArray(res.data) ? res.data : [];
      setShows(data);
    } catch (err) {
      console.error("Add show error:", err);
      toast.error("Failed to add show(s)");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => m.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [movies, searchQuery]);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <Title text1="Admin" text2="Add Show" />
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all w-64"
            />
          </div>
          <button
            onClick={handleSyncMovies}
            disabled={loading}
            className="text-sm bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-lg"
          >
            {loading ? "Syncing..." : "Sync TMDB Releases"}
          </button>
        </div>
      </div>

      {/* Grid of Movies */}
      <div className="mb-10">
        <p className="text-gray-400 mb-4 font-medium text-sm">Step 1: Select a Movie from the Grid</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[450px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {filteredMovies.map((movie) => {
            const isSelected = selectedMovie?._id === movie._id;
            const imgUrl = movie.posterUrl || movie.poster_Path ? (movie.posterUrl || `https://image.tmdb.org/t/p/w500${movie.poster_Path}`) : null;

            return (
              <div
                key={movie._id}
                onClick={() => {
                  setSelectedMovie(movie);
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className={`relative group bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                  isSelected ? "ring-2 ring-primary shadow-[0_0_20px_rgba(255,165,0,0.2)]" : "border border-gray-700 hover:border-gray-500 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start h-36">
                  <div className="w-24 h-full shrink-0">
                    {imgUrl ? (
                      <img src={imgUrl} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-500">No Image</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col justify-between h-full w-full">
                    <div>
                      <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight">{movie.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{movie.genre?.slice(0, 2).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {movie.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{movie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                      {movie.runtime && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{movie.runtime}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Show Form */}
      {selectedMovie && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-700/50">
            <div className="w-12 h-16 rounded overflow-hidden shadow-lg shrink-0">
              <img 
                src={selectedMovie.posterUrl || `https://image.tmdb.org/t/p/w500${selectedMovie.poster_Path}`} 
                alt="poster" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Step 2: Adding show dates for</p>
              <h3 className="text-2xl font-bold text-white leading-tight">{selectedMovie.title}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Settings */}
              <div className="space-y-5">
                <h4 className="text-lg font-semibold text-gray-200">Show Settings</h4>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-400 font-medium">Ticket Price (₹)</label>
                  <input
                    type="number"
                    value={showPrice}
                    onChange={(e) => setShowPrice(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm text-gray-400 font-medium">Status</label>
                  <label className="flex items-center cursor-pointer group w-max">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-300">
                      {isActive ? "Currently Active (Visible)" : "Inactive (Hidden)"}
                    </div>
                  </label>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-200">Schedule</h4>
                  <button
                    type="button"
                    onClick={handleAddDateInput}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition-colors"
                  >
                    + Add New Date
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {showInputs.map((block, idx) => (
                    <div key={idx} className="bg-gray-900/80 p-4 rounded-xl border border-gray-700/50">
                      <div className="mb-4">
                        <label className="block mb-1 text-xs text-gray-400 uppercase tracking-wider font-semibold">Date</label>
                        <input
                          type="date"
                          value={block.date}
                          onChange={(e) => handleInputChange(idx, "date", e.target.value)}
                          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-gray-400 uppercase tracking-wider font-semibold">Time Slots</label>
                        <div className="grid grid-cols-2 gap-2">
                          {block.time.map((t) => (
                            <input
                              key={t.id}
                              type="time"
                              value={t.value}
                              onChange={(e) => handleTimeChange(idx, block.time.indexOf(t), e.target.value)}
                              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none text-sm"
                              required
                            />
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddTime(idx)}
                            className="w-full p-2 rounded border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-colors text-sm flex items-center justify-center gap-1"
                          >
                            + Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700/50 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish Shows to Platform"}
              </button>
            </div>
          </form>

          {/* Existing Shows List */}
          {Array.isArray(shows) && shows.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-700/30">
              <h4 className="text-lg font-semibold text-gray-200 mb-4">Currently Scheduled Shows</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shows.map((show) => (
                  <div key={show._id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-primary font-medium">{new Date(show.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${show.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {show.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">
                      <span className="text-gray-500">Slots:</span> {Array.isArray(show.timeSlots) ? show.timeSlots.join(", ") : "N/A"}
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-500">Price:</span> ₹{show.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
