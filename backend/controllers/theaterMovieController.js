const TheaterMovie = require("../models/TheaterMovie");
const Theater = require("../models/Theater");
const Movie = require("../models/Movie");
const axios = require("axios");

const TMDB_HEADERS = () => ({
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  accept: "application/json",
});


// ─── Admin: Get all TMDB movies (for the assign dropdown) ────────────────────
// Returns movies from our DB (previously fetched from TMDB)
exports.getTmdbMoviesForAdmin = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.status(200).json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching movies", error: error.message });
  }
};

// ─── Admin: Assign a movie to a theater ──────────────────────────────────────
exports.assignMovieToTheater = async (req, res) => {
  try {
    const { theaterId, movieId } = req.body;

    if (!theaterId || !movieId) {
      return res.status(400).json({ success: false, message: "theaterId and movieId are required" });
    }

    // Verify theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ success: false, message: "Theater not found" });
    }

    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Create or update assignment (upsert)
    const assignment = await TheaterMovie.findOneAndUpdate(
      { theater: theaterId, movie: movieId },
      { theater: theaterId, movie: movieId },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: `✅ Movie "${movie.title}" assigned to theater "${theater.name}"`,
      assignment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Movie already assigned to this theater" });
    }
    res.status(500).json({ success: false, message: "Error assigning movie", error: error.message });
  }
};

// ─── Admin: Remove a movie assignment from a theater ─────────────────────────
exports.removeMovieFromTheater = async (req, res) => {
  try {
    const { theaterId, movieId } = req.params;

    const deleted = await TheaterMovie.findOneAndDelete({ theater: theaterId, movie: movieId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, message: "Movie removed from theater" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing movie", error: error.message });
  }
};

// ─── Admin: Get all assignments ───────────────────────────────────────────────
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await TheaterMovie.find()
      .populate("theater", "name location totalSeats")
      .populate("movie", "title poster_Path backdrop_Path bannerUrl vote_average releaseDate genre runtime");

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching assignments", error: error.message });
  }
};

// ─── Public: Get movies assigned to a specific theater ───────────────────────
exports.getMoviesByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ success: false, message: "Theater not found" });
    }

    const assignments = await TheaterMovie.find({ theater: theaterId })
      .populate("movie", "title poster_Path backdrop_Path bannerUrl vote_average releaseDate genre runtime description casts language");

    const movies = assignments.map((a) => a.movie);

    res.status(200).json({ success: true, theater, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching theater movies", error: error.message });
  }
};
