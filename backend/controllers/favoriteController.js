const User = require("../models/User");
const Movie = require("../models/Movie");

// Add a movie to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.auth?.userId; // Clerk auth
    const { movieId } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!movieId) return res.status(400).json({ success: false, message: "Movie ID required" });

    // Ensure movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });

    // Find user and update favorites
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $addToSet: { favorites: movie._id } }, // prevents duplicates
      { new: true, upsert: true }
    ).populate("favorites");

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding favorite", error: error.message });
  }
};

// Remove a movie from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const { movieId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { $pull: { favorites: movieId } },
      { new: true }
    ).populate("favorites");

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing favorite", error: error.message });
  }
};

// Get all favorites for logged-in user
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await User.findOne({ clerkId: userId }).populate("favorites");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching favorites", error: error.message });
  }
};
