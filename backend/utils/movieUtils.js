// backend/utils/movieUtils.js
const Movie = require('../models/Movie');

const saveMovieFromTMDB = async (tmdbMovie) => {
  try {
    let movie = await Movie.findOne({ tmdbId: tmdbMovie.id });

    if (!movie) {
      movie = new Movie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        poster_path: tmdbMovie.poster_path,
        overview: tmdbMovie.overview,
        release_date: tmdbMovie.release_date
      });
      await movie.save();
    }

    return movie._id; // MongoDB ObjectId
  } catch (err) {
    console.error("Error saving TMDB movie:", err.message);
    throw err;
  }
};

module.exports = { saveMovieFromTMDB };
