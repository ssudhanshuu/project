import React, { useState, useEffect } from "react";
import axios from "axios";
import { CalendarIcon, GlobeIcon, Loader2 } from "lucide-react";

export default function Releases() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // TMDB API Token from user
  const tmdbToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjgyNDI1NDliOTRkY2QyMDdmODI3ZWU0MWE1ZjFmZSIsIm5iZiI6MTc1Mjk2MDU2NC4zMDgsInN1YiI6IjY4N2MwZTM0MjU2ZTYwYWEzYzUyODg5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yUH7Aw1Sy2Cuw2TcxvMtVirfyvlWF7wXaC7fhpPBU-c";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken}`
          }
        };
        const res = await fetch(url, options);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleFetchReleases = async (movie) => {
    if (selectedMovie?.id === movie.id) {
      // Toggle off if already selected
      setSelectedMovie(null);
      setReleaseDates([]);
      return;
    }

    setSelectedMovie(movie);
    setLoadingDates(true);
    setError(null);

    const tmdbId = movie.id;
    if (!tmdbId) {
      setError("No TMDB ID found for this movie.");
      setLoadingDates(false);
      return;
    }

    try {
      const url = `https://api.themoviedb.org/3/movie/${tmdbId}/release_dates`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbToken}`,
        },
      };

      const res = await fetch(url, options);
      const json = await res.json();
      
      if (json.results) {
        setReleaseDates(json.results);
      } else {
        setError("No release dates found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch release dates.");
    } finally {
      setLoadingDates(false);
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 1: return "Premiere";
      case 2: return "Theatrical (Limited)";
      case 3: return "Theatrical";
      case 4: return "Digital";
      case 5: return "Physical";
      case 6: return "TV";
      default: return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111115]">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111115] text-white pt-28 px-6 lg:px-36 pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Global Release Dates
      </h1>
      
      <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Select a movie to explore its exact release dates across different regions and platforms, powered by TMDB.
      </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => {
          const imageSrc = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : "/ForMissingImage.png";

          const isSelected = selectedMovie?.id === movie.id;

          return (
            <div
              key={movie.id}
              className={`bg-[#1a1a24] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 border ${
                isSelected ? "border-purple-500 shadow-purple-500/20" : "border-gray-800 hover:border-gray-600"
              }`}
            >
              <div 
                className="relative h-64 cursor-pointer overflow-hidden group"
                onClick={() => handleFetchReleases(movie)}
              >
                <img
                  src={imageSrc}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium">
                    {isSelected ? "Hide Dates" : "View Dates"}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-bold truncate mb-2">{movie.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "TBA"}
                  </span>
                </div>

                {/* Expanded Section */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                    {loadingDates ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                      </div>
                    ) : error ? (
                      <p className="text-red-400 text-sm text-center py-2">{error}</p>
                    ) : releaseDates.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {releaseDates.slice(0, 10).map((region, idx) => (
                          <div key={idx} className="bg-[#23232f] p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
                              <GlobeIcon className="w-4 h-4" />
                              <span>{region.iso_3166_1}</span>
                            </div>
                            <div className="space-y-2">
                              {region.release_dates.map((rd, i) => (
                                <div key={i} className="text-xs flex justify-between items-center bg-[#1a1a24] p-2 rounded">
                                  <span className="text-gray-300">
                                    {new Date(rd.release_date).toLocaleDateString()}
                                  </span>
                                  <span className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded text-[10px]">
                                    {getTypeLabel(rd.type)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-2">No specific release dates available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
