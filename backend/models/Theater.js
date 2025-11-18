const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
