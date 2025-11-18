const Theater = require("../models/Theater");

// Create
const createTheater = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all
const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTheater,
  getTheaters,
};
