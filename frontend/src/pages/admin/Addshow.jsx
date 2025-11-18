import React, { useEffect, useState } from "react";
import Title from "./Title";
import axios from "../../lib/axiosInstance";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "https://project-1-ahno.onrender.com";

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [shows, setShows] = useState([]);
  const [previousShows, setPreviousShows] = useState([]);
  const [showInputs, setShowInputs] = useState([
    { date: "", time: [{ id: Date.now(), value: "" }] },
  ]);
  const [showPrice, setShowPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch all movies on mount
  useEffect(() => {
    axios
      .get(`${API_URL}/api/movies`)
      .then((res) => {
        if (res.data.success) setMovies(res.data.movies);
      })
      .catch((err) => {
        console.error("Movies fetch error:", err);
        toast.error("Failed to fetch movies");
      });
  }, []);

  // Fetch shows when selectedMovie changes
  useEffect(() => {
    if (!selectedMovie) {
      setShows([]);
      setPreviousShows([]);
      return;
    }

    axios
      .get(`${API_URL}/api/shows`, { params: { movieId: selectedMovie } })
      .then((res) => {
        const data = Array.isArray(res.data.shows)
          ? res.data.shows
          : Array.isArray(res.data)
          ? res.data
          : [];
        setShows(data);
      })
      .catch((err) => {
        console.error("Shows fetch error:", err);
        toast.error("Failed to fetch shows for this movie");
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
    setShowInputs((prev) => [
      ...prev,
      { date: "", time: [{ id: Date.now(), value: "" }] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie || !showPrice || showInputs.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    const previousCount = previousShows.length;

    try {
      setLoading(true);

      await Promise.all(
        showInputs.map(({ date, time }) =>
          axios.post(`${API_URL}/api/shows/add`, {
            movieId: selectedMovie,
            date,
            timeSlots: time.map((t) => t.value),
            price: showPrice,
            isActive,
          })
        )
      );

      toast.success("Show(s) added!");
      setShowPrice("");
      setIsActive(true);
      setShowInputs([{ date: "", time: [{ id: Date.now(), value: "" }] }]);

      const res = await axios.get(`${API_URL}/api/shows`, {
        params: { movieId: selectedMovie },
      });
      const data = Array.isArray(res.data.shows)
        ? res.data.shows
        : Array.isArray(res.data)
        ? res.data
        : [];

      setShows(data);
      setPreviousShows(data);

      if (data.length > previousCount) {
        toast.success("New show(s) added successfully!");
      }
    } catch (err) {
      console.error("Add show error:", err);
      toast.error("Failed to add show(s)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen mt-15 bg-black text-white">
      <aside className="w-[12%] min-w-[200px] bg-white text-black"></aside>

      <main className="flex-1 p-8">
        <Title text1="Admin" text2="Add Show" />

        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-800 p-6 rounded-lg space-y-6"
        >
          {/* Movie Select */}
          <div>
            <label className="block mb-2 font-semibold">Select Movie</label>
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full p-2 rounded bg-white text-black"
              required
            >
              <option value="">-- Select Movie --</option>
              {movies.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 font-semibold">Show Price</label>
            <input
              type="number"
              value={showPrice}
              onChange={(e) => setShowPrice(e.target.value)}
              placeholder="Enter show price"
              className="w-full p-2 rounded bg-white text-black"
              required
            />
          </div>

          {/* Is Active */}
          <div>
            <label className="block mb-2 font-semibold">Is Active</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <span>{isActive ? "Active" : "Inactive"}</span>
          </div>

          {/* Date & Time Inputs */}
          {showInputs.map((block, idx) => (
            <div key={idx} className="bg-gray-700 p-4 rounded space-y-2">
              <label className="block font-semibold">Date</label>
              <input
                type="date"
                value={block.date}
                onChange={(e) =>
                  handleInputChange(idx, "date", e.target.value)
                }
                className="w-full p-2 rounded bg-white text-black"
                required
              />

              <label className="block font-semibold mt-2">Time Slots</label>
              {block.time.map((t) => (
                <input
                  key={t.id}
                  type="time"
                  value={t.value}
                  onChange={(e) =>
                    handleTimeChange(idx, block.time.indexOf(t), e.target.value)
                  }
                  className="w-full p-2 rounded bg-white text-black mt-1"
                  required
                />
              ))}

              <button
                type="button"
                onClick={() => handleAddTime(idx)}
                className="mt-2 text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                + Add Time
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddDateInput}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Another Show Date
          </button>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary px-6 py-2 rounded hover:bg-primary/90"
            >
              {loading ? "Submitting..." : "Add Show(s)"}
            </button>
          </div>
        </form>

        {/* Existing Shows List */}
        {Array.isArray(shows) && shows.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Existing Shows</h2>
            <ul className="space-y-4">
              {shows.map((show) => (
                <li key={show._id} className="bg-gray-700 p-4 rounded">
                  <p>Date: {new Date(show.date).toLocaleDateString()}</p>
                  <p>
                    Time Slots:{" "}
                    {Array.isArray(show.timeSlots)
                      ? show.timeSlots.join(", ")
                      : "No time slots"}
                  </p>
                  <p>Price: ₹{show.price}</p>
                  <p>Status: {show.isActive ? "✅ Active" : "❌ Inactive"}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
