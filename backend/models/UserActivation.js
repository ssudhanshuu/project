const mongoose = require("mongoose");

const userActivationSchema = new mongoose.Schema({
  _id: String,
  email: String,
  name: String,
  image: String,
});

module.exports = mongoose.model("UserActivation", userActivationSchema);
