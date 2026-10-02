const mongoose = require("mongoose");

// Tracks which movies (from our DB) admin has assigned to a theater
const theaterMovieSchema = new mongoose.Schema(
  {
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate assignments
theaterMovieSchema.index({ theater: 1, movie: 1 }, { unique: true });

const TheaterMovie = mongoose.model("TheaterMovie", theaterMovieSchema);

module.exports = TheaterMovie;
