import React, { useEffect, useState } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function DateSelect() {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [selected, setSelected] = useState(null);
  const [dateTime, setDateTime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchShows = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/shows`);
        if (cancelled) return;

        const allShows = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.shows)
          ? res.data.shows
          : [];

        const filtered = allShows
          .filter((s) => s.movie === movieId || s.movie?._id === movieId)
          .filter((s) => s.isActive && s.date && !isNaN(new Date(s.date)));

        const uniqueDates = [
          ...new Set(
            filtered.map((s) => new Date(s.date).toISOString().split("T")[0])
          ),
        ].sort((a, b) => new Date(a) - new Date(b));

        setDateTime(uniqueDates);
      } catch (err) {
        console.error("Shows lookup failed:", err);
        if (!cancelled) setError("Failed to fetch shows.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchShows();
    return () => {
      cancelled = true;
    };
  }, [API_URL, movieId]);

  const onBookHandler = () => {
    if (!selected) {
      toast.error("Please select a date");
      return;
    }
    navigate(`/movies/${movieId}/${selected}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <div>Loading dates...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col mb-10 mt-[120px] overflow-hidden md:flex-row items-start justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
      <BlurCircle top="-100px" left="-100px" className="z-0" />
      <BlurCircle top="100px" left="0px" className="z-0" />

      <div className="flex-1 z-10">
        <p className="text-lg text-center font-semibold">Choose Date</p>
        <div className="flex items-center gap-6 text-sm mt-5">
          <ChevronLeftIcon width={28} />
          <div className="grid grid-cols-4 md:flex flex-wrap md:max-w-lg gap-4 z-10">
            {dateTime.map((date) => (
              <button
                key={date}
                onClick={() => setSelected(date)}
                className={`flex flex-col items-center justify-center h-16 w-16 rounded cursor-pointer transition-all ${
                  selected === date
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 hover:bg-orange-500 hover:text-white"
                }`}
              >
                <span>{new Date(date).getDate()}</span>
                <span>
                  {new Date(date).toLocaleString("en-US", { month: "short" })}
                </span>
              </button>
            ))}
          </div>
          <ChevronRightIcon width={28} />
          <button
            onClick={onBookHandler}
            disabled={!selected}
            className={`px-8 py-2 rounded transition-all cursor-pointer ml-auto ${
              selected
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
