// utils/tmdbClient.js
const axios = require('axios');
const axiosRetry = require('axios-retry');
require('dotenv').config();

if (!process.env.TMDB_API_KEY && !process.env.TMDB_ACCESS_TOKEN) {
  console.warn('⚠️ TMDB API key or access token is missing in .env');
}

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 5000,
  params: process.env.TMDB_API_KEY ? { api_key: process.env.TMDB_API_KEY } : {},
  headers: process.env.TMDB_ACCESS_TOKEN
    ? { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` }
    : {}
});

// Retry on network errors or 5xx responses
axiosRetry(tmdb, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === 'ECONNRESET'
});

module.exports = tmdb;
