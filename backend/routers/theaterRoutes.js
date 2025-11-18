const express = require("express");
const protectAdmin = require("../middleware/protectAdmin");
const { createTheater, getTheaters } = require("../controllers/theaterController");

const router = express.Router();

// Create theater
router.post("/create", protectAdmin, createTheater);

// Get all theaters
router.get("/", getTheaters);

module.exports = router;
