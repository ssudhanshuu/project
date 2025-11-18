// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movie-ticket";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
