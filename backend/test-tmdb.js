require('dotenv').config();
const axios = require('axios');

async function testTMDB() {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    console.log('TMDB data fetched successfully');
    console.log(response.data);
  } catch (error) {
    console.error('TMDB fetch error:', error.message);
  }
}

testTMDB();
