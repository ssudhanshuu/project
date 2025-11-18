// src/pages/FullDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import BlurCircle from "../component/BlurCircle";
import { StarIcon, PlayCircleIcon, Heart } from "lucide-react";
import DateSelect from "../component/DateSelect";
import FeaturedSection from "../component/FeaturedSection";
import ForMissingImage from "/ForMissingImage.png";

export default function FullDetails() {
  const { id } = useParams();               // movie _id from URL
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dateSelectRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://project-1-ahno.onrender.com";

  const toIdString = (raw) => {
    if (!raw) return "";
    if (typeof raw === "object" && raw._id) return String(raw._id);
    return String(raw);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/movies/${id}`);
        if (!cancelled) setMovie(res.data.movie ?? res.data ?? null);
      } catch (err) {
        console.error("Movie lookup failed:", err);
        if (!cancelled) setError("Movie not found or server error.");
      }
    };

    const fetchShows = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/shows`);
        if (cancelled) return;

        const allShows = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.shows)
          ? res.data.shows
          : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = allShows
          .filter((s) => toIdString(s.movie) === id)
          .filter((s) => s.isActive)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (!cancelled) setShows(filtered);
      } catch (err) {
        console.error("Shows lookup failed:", err);
        if (!cancelled) setShows([]);
      }
    };

    Promise.all([fetchMovie(), fetchShows()]).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [API_URL, id]);

  const timeFormat = (mins) => {
    if (!mins && mins !== 0) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading details…</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!movie) return <div className="text-center py-10 text-gray-600">Couldn’t load movie data.</div>;

  const isShowAvailable = shows.length > 0;

  const imageSrc = movie.bannerUrl
    ? `https://image.tmdb.org/t/p/w500${movie.bannerUrl}`
    : movie.posterUrl
    ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
    : movie.backdrop_Path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_Path}`
    : ForMissingImage;

  return (
    <div className="px-8 pt-20 md:pt-30">
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        <img src={imageSrc} alt={movie.title || "Movie poster"} className="rounded-xl h-[500px] w-full max-w-sm object-cover" />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary">Languages: {movie.language?.toUpperCase() || "N/A"}</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{movie.title || "Untitled"}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {(typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "—")} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">{movie.description || "No description available."}</p>

          <p className="text-gray-300 mt-1 text-sm">
            {timeFormat(movie.runtime)} | {Array.isArray(movie.genre) ? movie.genre.join(", ") : "—"} | {movie.releaseDate?.split("-")[0] || "—"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button className="px-4 py-2 w-full flex justify-center items-center gap-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
              <PlayCircleIcon />
              Watch Trailer
            </button>

            {isShowAvailable ? (
              <button
                onClick={() => dateSelectRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="px-4 py-2 w-full text-center bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Buy Tickets
              </button>
            ) : (
              <div className="px-4 py-2 w-full text-center bg-gray-200 text-gray-700 rounded-md">
                This movie show is not available
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-lg font-medium mt-20">Your Favorite Casts</p>
      <div className="no-scrollbar overflow-x-auto mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {Array.isArray(movie.casts) && movie.casts.length > 0 ? (
            movie.casts.slice(0, 12).map((name, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="rounded-full h-20 w-20 bg-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-800 font-medium">{String(name).split(" ")[0]}</span>
                </div>
                <p className="mt-1 text-sm">{name}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 px-4">No cast information available.</p>
          )}
        </div>
      </div>

      <div>
        <DateSelect ref={dateSelectRef} />
      </div>

      <p className="text-lg font-medium mt-20 mb-10">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        <FeaturedSection />
      </div>
    </div>
  );
}
