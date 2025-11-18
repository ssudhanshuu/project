const axios = require('axios');
const Movie = require('../models/Movie');
const axiosRetry = require('axios-retry');
const pLimit = require("p-limit");
 // Adjust path as needed

const limit = pLimit(5); // Controls concurrency

exports.fetchAndSaveMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
    
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        accept: "application/json"
      },
      params: {
        language: "en-US",
        page: 1
      },
      timeout: 10000
    });

    const moviesData = tmdbRes.data.results.slice(0, 20); // ✅ Limit to 20 movies

    const moviePromises = moviesData.map((m) =>
      limit(async () => {
        try {
          const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}`, {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
              accept: "application/json"
            },
            params: {
              language: "en-US",
              append_to_response: "credits"
            },
            timeout: 10000
          });

          const details = movieDetails.data;

          await Movie.findOneAndUpdate(
            { tmdbId: m.id },
            {
              tmdbId: m.id,
              title: details.title,
              description: details.overview,
              genre: details.genres.map((g) => g.name),
              language: details.original_language,
              releaseDate: details.release_date,
              poster_Path: details.poster_path,
              backdrop_Path: details.backdrop_path,
              bannerUrl: `https://image.tmdb.org/t/p/original${details.backdrop_path}`,
              runtime: details.runtime,
              vote_average: details.vote_average,
              casts: details.credits.cast.map((c) => c.name),
              price: 250
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error(`❌ Failed to fetch movie ${m.id} (${m.title}):`, err.message);
        }
      })
    );

    await Promise.all(moviePromises);

    res.status(200).json({ success: true, message: "✅ 20 movies fetched and saved successfully" });
  } catch (error) {
   
    console.error("🔥 Error fetching movies:", error.message);
    res.status(500).json({ success: false, message: "Error fetching movies", error: error.message });
  }
};


exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.status(200).json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching movies', error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching movie', error: error.message });
  }
};
