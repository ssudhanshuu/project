const express = require('express');
const {
  fetchAndSaveMovies,
  getAllMovies,
  getMovieById,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTrendingMovies
} = require('../controllers/movieController');
const protectAdmin = require('../middleware/protectAdmin');

const router = express.Router();

// Admin: Fetch from TMDB and save to DB
router.get('/fetch', fetchAndSaveMovies);

// TMDB live endpoints
router.get('/upcoming', getUpcomingMovies);         // for Home page
router.get('/now-playing', getNowPlayingMovies);    // for Movies page
router.get('/trending', getTrendingMovies);          // bonus

// DB movies (all saved movies)
router.get('/', getAllMovies);
router.get('/:id', getMovieById);

module.exports = router;
