const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [
    {
      type: String, // e.g., "10:00 AM"
      required: true
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lockedSeats: {
    type: [String], // e.g., ["A1", "A2"] - these are seats temporarily held
    default: [],
  }
});

module.exports = mongoose.model("Show", showSchema);
