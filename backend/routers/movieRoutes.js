const express = require('express');
const { fetchAndSaveMovies, getAllMovies, getMovieById } = require('../controllers/movieController');
const { clerkMiddleware, requireAuth } = require('@clerk/express'); // ✅ Import Clerk's middleware
const protectAdmin = require('../middleware/protectAdmin'); // ✅ Import admin protection

const router = express.Router();


router.get('/fetch', fetchAndSaveMovies); // ✅ Protected


router.get('/', getAllMovies);


router.get('/:id', getMovieById);

module.exports = router;
