const express = require("express");
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoriteController");
const requireAuth = require("../middleware/requireAuth");

// Protect routes
router.use(requireAuth);

router.post("/", addFavorite); // Add to favorites
router.delete("/:movieId", removeFavorite); // Remove
router.get("/my", getFavorites); // Get all favorites

module.exports = router;
