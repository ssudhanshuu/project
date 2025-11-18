// src/pages/admin/AddUpcomingMovie.jsx

import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function AddUpcomingMovie() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    poster_Path: "",
    language: "",
    genre: "",
    runtime: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/movies`, {
        ...form,
        genre: form.genre.split(",").map((g) => g.trim()),
      });
      alert("Movie added successfully!");
      setForm({
        title: "",
        description: "",
        releaseDate: "",
        poster_Path: "",
        language: "",
        genre: "",
        runtime: "",
        price: "",
      });
    } catch (err) {
      console.error("Error adding movie:", err);
    }
  };

  return (
    <div className="p-6 mt-15 ml-45 bg-gray-600 w-3/7  sm:w-3/6  md:w-3/4 lg:w-5/6  mr-50">
      <h2 className="text-2xl font-bold mb-6">Add Upcoming Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="releaseDate"
          value={form.releaseDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="poster_Path"
          placeholder="Poster URL"
          value={form.poster_Path}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="genre"
          placeholder="Genre (comma separated)"
          value={form.genre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="runtime"
          placeholder="Runtime (minutes)"
          value={form.runtime}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}

export default AddUpcomingMovie;
