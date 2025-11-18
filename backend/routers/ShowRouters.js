const express = require('express');
const router = express.Router();
const showController = require('../controllers/showControllers');

router.get('/list', showController.getShowsByMovieAndDate);
router.get('/:id', showController.getShowById); 
router.post('/add', showController.createShow);// Get all shows
router.get('/', showController.getAllShows); // Get all shows for admin

module.exports = router;
