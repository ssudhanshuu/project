// backend/routers/adminRoutes.js
const router = require("express").Router();
const { requireAuth } = require("@clerk/express"); // correct import
const protectAdmin = require("../middleware/protectAdmin");

const { getAdminDashboardData } = require("../controllers/adminController");
const { getAllBookings } = require("../controllers/BookingController");

// Admin-only routes
router.get("/dashboard", requireAuth(), protectAdmin, getAdminDashboardData);
router.get("/bookings", requireAuth(), protectAdmin, getAllBookings);

module.exports = router;
