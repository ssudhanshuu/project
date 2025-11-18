const express = require('express');
const { createOrder, paymentCallback } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/callback', paymentCallback);

module.exports = router; // ✅ must export router
