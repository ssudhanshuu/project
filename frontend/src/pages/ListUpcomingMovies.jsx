// src/pages/admin/ListUpcomingMovies.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../lib/apiConfig";

// API_URL imported from apiConfig

function ListUpcomingMovies() {
  const [movies, setMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/movies/upcoming`);
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching upcoming movies:", err);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/movies/${id}`);
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="p-6 bg-[#1a1a24] text-white rounded-xl shadow border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Upcoming Movies (Admin)</h2>
      {movies.length === 0 ? (
        <p>No upcoming movies found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Poster</th>
              <th className="p-2">Title</th>
              <th className="p-2">Release Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id} className="border-t">
                <td className="p-2">
                  <img
                    src={movie.poster_Path}
                    alt={movie.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                </td>
                <td className="p-2">{movie.title}</td>
                <td className="p-2">
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <Button
                    variant="destructive"
                    onClick={() => deleteMovie(movie._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListUpcomingMovies;
