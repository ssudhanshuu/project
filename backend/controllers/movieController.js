const axios = require('axios');
const Movie = require('../models/Movie');
const axiosRetry = require('axios-retry');
const pLimit = require("p-limit");

const limit = pLimit(5); // Controls concurrency

const TMDB_HEADERS = () => ({
  Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  accept: "application/json"
});

// ─── Fetch now_playing from TMDB & save to DB ────────────────────────────────
exports.fetchAndSaveMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      headers: TMDB_HEADERS(),
      params: { language: "en-US", page: 1 },
      timeout: 10000
    });

    const moviesData = tmdbRes.data.results.slice(0, 20);

    const moviePromises = moviesData.map((m) =>
      limit(async () => {
        try {
          const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}`, {
            headers: TMDB_HEADERS(),
            params: { language: "en-US", append_to_response: "credits" },
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
              casts: details.credits?.cast?.map((c) => c.name) || [],
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

// ─── Get all movies from our DB ───────────────────────────────────────────────
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: -1 });
    res.status(200).json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching movies', error: error.message });
  }
};

// ─── Get single movie by DB ID ────────────────────────────────────────────────
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

// ─── Upcoming movies (live from TMDB) ─────────────────────────────────────────
exports.getUpcomingMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/movie/upcoming", {
      headers: TMDB_HEADERS(),
      params: { language: "en-US", page: 1 },
      timeout: 10000
    });

    const movies = tmdbRes.data.results.map((m) => ({
      tmdbId: m.id,
      title: m.title,
      description: m.overview,
      releaseDate: m.release_date,
      poster_Path: m.poster_path,
      backdrop_Path: m.backdrop_path,
      bannerUrl: m.backdrop_path
        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
        : null,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      vote_average: m.vote_average,
      genre: m.genre_ids // raw ids, resolved on frontend if needed
    }));

    res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error("🔥 Error fetching upcoming movies:", error.message);
    res.status(500).json({ success: false, message: "Error fetching upcoming movies", error: error.message });
  }
};

// ─── Now Playing movies (live from TMDB) ─────────────────────────────────────
exports.getNowPlayingMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      headers: TMDB_HEADERS(),
      params: { language: "en-US", page: 1 },
      timeout: 10000
    });

    const movies = tmdbRes.data.results.map((m) => ({
      tmdbId: m.id,
      title: m.title,
      description: m.overview,
      releaseDate: m.release_date,
      poster_Path: m.poster_path,
      backdrop_Path: m.backdrop_path,
      bannerUrl: m.backdrop_path
        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
        : null,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      vote_average: m.vote_average,
    }));

    res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error("🔥 Error fetching now playing movies:", error.message);
    res.status(500).json({ success: false, message: "Error fetching now playing movies", error: error.message });
  }
};

// ─── Trending movies (live from TMDB) ────────────────────────────────────────
exports.getTrendingMovies = async (req, res) => {
  try {
    const tmdbRes = await axios.get("https://api.themoviedb.org/3/trending/all/day", {
      headers: TMDB_HEADERS(),
      params: { language: "en-US" },
      timeout: 10000
    });

    const movies = tmdbRes.data.results.slice(0, 20).map((m) => ({
      tmdbId: m.id,
      title: m.title || m.name,
      description: m.overview,
      releaseDate: m.release_date || m.first_air_date,
      poster_Path: m.poster_path,
      backdrop_Path: m.backdrop_path,
      bannerUrl: m.backdrop_path
        ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
        : null,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      vote_average: m.vote_average,
      media_type: m.media_type
    }));

    res.status(200).json({ success: true, movies });
  } catch (error) {
    console.error("🔥 Error fetching trending movies:", error.message);
    res.status(500).json({ success: false, message: "Error fetching trending movies", error: error.message });
  }
};
