const Show = require('../models/Show');
const Movie = require('../models/Movie');
const axios = require('axios');

// Save movie from TMDB if not already in DB
const saveMovieFromTMDB = async (tmdbMovieId) => {
  let movie = await Movie.findOne({ tmdbId: tmdbMovieId });

  if (!movie) {
    try {
      const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}`, {
        headers: { // Use Authorization header for consistency
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          accept: "application/json"
        },
        params: {
          language: 'en-US',
          append_to_response: 'credits' // to get cast
        }
      });

      const tmdbMovie = tmdbRes.data;

      // Extract genre names
      const genres = tmdbMovie.genres?.map(g => g.name) || [];

      // Extract cast names (first 5)
      const castList = tmdbMovie.credits?.cast?.slice(0, 5).map(actor => actor.name) || [];

      movie = new Movie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        description: tmdbMovie.overview,
        genre: genres,
        language: tmdbMovie.original_language,
        releaseDate: tmdbMovie.release_date,
        poster_Path: tmdbMovie.poster_path,
        backdrop_Path: tmdbMovie.backdrop_path,
        bannerUrl: `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`,
        runtime: tmdbMovie.runtime,
        vote_average: tmdbMovie.vote_average,
        casts: castList, // Use 'casts' as per your Movie model
        price: 250 // Default price; align with movieController
      });

      await movie.save();
    } catch (error) {
      throw new Error(`Failed to fetch movie from TMDB: ${error.message}`);
    }
  }

  return movie._id;
};

// GET /shows?movieId=...&date=...
exports.getShowsByMovieAndDate = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    if (!movieId || !date) {
      return res.status(400).json({ message: 'Movie ID and date are required' });
    }

    const normalizedDate = new Date(date);
    if (isNaN(normalizedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const shows = await Show.find({
      movie: movieId,
      date: normalizedDate
    }).populate('movie').lean();

    res.status(200).json(shows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shows', error: err.message });
  }
};

// POST /shows
exports.createShow = async (req, res) => {
  try {
    const { movieId, date, timeSlots, price, isActive } = req.body;

    // Validation
    if (!movieId || !date || !Array.isArray(timeSlots) || timeSlots.length === 0 || price == null || isActive == null) {
      return res.status(400).json({ message: 'movieId, date, timeSlots (array), price, and isActive are required' });
    }

    const normalizedDate = new Date(date);
    if (isNaN(normalizedDate )) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Optional: Prevent duplicate shows for same movie and date
    const existingShow = await Show.findOne({ movie: movieId, date: normalizedDate });
    if (existingShow) {
      return res.status(409).json({ message: 'Show already exists for this movie and date' });
    }

    const show = new Show({
      movie: movieId,
      date: normalizedDate,
      timeSlots,
      price,
      isActive // ✅ Added isActive here
    });

    await show.save();
    res.status(201).json({ message: "Show created successfully", show });
  } catch (error) {
    res.status(500).json({ message: "Error creating show", error: error.message });
  }
};
// GET /shows/:id
exports.getShowById = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id).populate('movie');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.status(200).json(show);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching show', error: error.message });
  }
};

// GET /shows
exports.getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate('movie', 'title poster_Path bannerUrl backdrop_Path vote_average')
      .lean();

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shows', error: error.message });
  }
};
