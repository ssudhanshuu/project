const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }],
  amount: { type: Number, required: true },

  // ✅ Payment fields
  isPaid: { type: Boolean, default: false },
  paymentConfirmedAt: { type: Date },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }
});

module.exports = mongoose.model("Booking", bookingSchema);
