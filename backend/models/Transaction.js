const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  txnid:      { type: String, unique: true },
  bookingId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount:     Number,
  firstname:  String,
  email:      String,
  phone:      String,
  productinfo:String,
  status:     { type: String, default: 'pending' },
  createdAt:  { type: Date, default: Date.now }
})

module.exports = mongoose.model('Transaction', transactionSchema)
