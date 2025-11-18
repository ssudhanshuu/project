const express = require('express');
const router = express.Router();
const { clerkMiddleware, requireAuth } = require('@clerk/express'); // Import Clerk's middleware

const {
  getBookedSeats,
  createBooking,
  getUserBookings,
  getMyBookings,
  getAllBookings,
  getAllBookingsForAdmin,
  lockShowSeats,
  getLockedSeatsHandler,
  releaseShowSeats,
  generateTicketPDF
} = require('../controllers/BookingController');
const clerkAuth = require('../middleware/clerkAuth');

// Routes
router.get('/seats/:showId', getBookedSeats); // Publicly accessible to check available seats
router.post('/create', clerkMiddleware(), clerkAuth, createBooking); // Protected
router.get('/user/:userId', clerkMiddleware(), requireAuth(), getUserBookings); // Protected

router.get('/my', clerkAuth, getMyBookings);
router.post('/', clerkAuth, createBooking);

router.get('/admin', clerkMiddleware(), requireAuth(), getAllBookings); // Protected (Admin-only via protectAdmin in adminRoutes)
router.get('/admin-all', clerkMiddleware(), requireAuth(), getAllBookingsForAdmin); // Protected (Admin-only via protectAdmin in adminRoutes)

// Seat locking/releasing routes
router.post("/lock", clerkMiddleware(), requireAuth(), lockShowSeats); // Protected
router.get("/locked/:showId", getLockedSeatsHandler); // Changed to :showId only
router.post('/release', clerkMiddleware(), requireAuth(), releaseShowSeats); // Protected

router.get('/pdf/:bookingId', generateTicketPDF); // Publicly accessible for ticket download

module.exports = router;
