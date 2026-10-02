const express = require("express");
const router = express.Router();
const protectAdmin = require("../middleware/protectAdmin");
const { requireAuth } = require("@clerk/express");

const {
  getTmdbMoviesForAdmin,
  assignMovieToTheater,
  removeMovieFromTheater,
  getAllAssignments,
  getMoviesByTheater,
} = require("../controllers/theaterMovieController");

// Public: Get movies assigned to a specific theater
router.get("/:theaterId/movies", getMoviesByTheater);

// Admin: Get all assignments (for admin overview)
router.get("/assignments/all", requireAuth(), protectAdmin, getAllAssignments);

// Admin: Assign a movie to a theater
router.post("/assign", requireAuth(), protectAdmin, assignMovieToTheater);

// Admin: Remove a movie from a theater
router.delete(
  "/:theaterId/movies/:movieId",
  requireAuth(),
  protectAdmin,
  removeMovieFromTheater
);

module.exports = router;
