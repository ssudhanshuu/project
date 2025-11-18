const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
 
  tmdbId: Number,
  title: String,
  description: String,
  genre: [String],
  language: String,
  releaseDate: String,
  poster_Path: String,
  backdrop_Path: String,
  bannerUrl: String,
  runtime: Number,
  vote_average: Number,
  casts: [String],
  price: Number
});

module.exports = mongoose.model('Movie', MovieSchema);
