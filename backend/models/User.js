const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  name: String,
  // Add favorites as an array of movie references
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
