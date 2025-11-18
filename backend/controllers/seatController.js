const { lockSeats, getLockedSeats } = require("../utils/seatLockManager");

// Lock selected seats temporarily (5 mins)
exports.lockSeats = async (req, res) => {
  try {
    const { showId, time, seats, userId } = req.body;
    if (!showId || !time || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    lockSeats(showId, time, seats, userId);
    return res.json({ success: true, message: "Seats locked successfully" });
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

// Get all locked seats for a show and time slot
exports.getLockedSeats = async (req, res) => {
  try {
    const { showId, time } = req.params;
    const locked = getLockedSeats(showId, time);
    return res.json({ lockedSeats: locked });
  } catch (err) {
    return res.json({ lockedSeats: [] });
  }
};
