const router = require("express").Router();
const { lockSeats, getLockedSeats } = require("../controllers/seatController");
const clerkAuth = require("../middleware/clerkAuth");
const requireAuth = require("../middleware/requireAuth");

router.get("/locked/:showId/:time", getLockedSeats);
router.post("/lock", clerkAuth, lockSeats);

module.exports = router;
