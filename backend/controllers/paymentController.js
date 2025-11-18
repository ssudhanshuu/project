// controllers/paymentController.js
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Transaction = require('../models/Transaction');

const buildHash = (fields) =>
  crypto.createHash('sha512').update(fields.join('|')).digest('hex');

exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount, email, phone, name } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.isPaid) return res.status(400).json({ error: 'Already paid' });

    const txnid = 'txn' + Date.now();

    await Transaction.create({
      txnid,
      bookingId,
      amount,
      firstname: name,
      email,
      phone,
      productinfo: `Booking#${bookingId}`,
      status: 'pending'
    });

    const udf = Array(10).fill('').join('|'); // udf1–udf10
    const hashFields = [
      process.env.PAYU_MERCHANT_KEY,
      txnid,
      amount,
      `Booking#${bookingId}`,
      name,
      email,
      udf,
      process.env.PAYU_MERCHANT_SALT
    ];

    const hash = buildHash(hashFields);

    return res.json({
      payuURL: process.env.PAYU_BASE_URL,
      params: {
        key: process.env.PAYU_MERCHANT_KEY,
        txnid,
        amount,
        productinfo: `Booking#${bookingId}`,
        firstname: name,
        email,
        phone,
        surl: process.env.PAYU_SURL,
        furl: process.env.PAYU_FURL,
        hash
      }
    });
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    console.log('🔔 Callback received:', req.body);

    const { key, txnid, amount, productinfo, firstname, email, status, hash } = req.body;

    const udf = Array(10).fill('').join('|'); // udf1–udf10
    const reverseFields = [
      process.env.PAYU_MERCHANT_SALT,
      status,
      udf,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      key
    ];

    const expectedHash = crypto.createHash('sha512').update(reverseFields.join('|')).digest('hex');

    if (expectedHash !== hash) {
      console.warn('Hash mismatch:', { expectedHash, receivedHash: hash });
      return res.status(400).send('Hash mismatch – possible tampering');
    }

    await Transaction.findOneAndUpdate({ txnid }, { status });

    const bookingId = productinfo.replace('Booking#', '');

    if (status.toLowerCase() === 'success') {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentConfirmedAt: new Date()
      });
      return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).send('Callback failed');
  }
};
