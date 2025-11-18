const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const PDFDocument = require("pdfkit");
const mongoose = require('mongoose');
const QRCode = require("qrcode");

const getBookedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({ message: 'Invalid show ID' });
    }

    const bookings = await Booking.find({ show: showId }).select('seats');
    const bookedSeats = bookings.flatMap(booking => booking.seats);

    const show = await Show.findById(showId).select('lockedSeats');
    const currentlyLockedSeats = show ? show.lockedSeats : [];

    const allUnavailableSeats = [...new Set([...bookedSeats, ...currentlyLockedSeats])];

    res.status(200).json(allUnavailableSeats);
  } catch (err) {
    console.error('Error fetching booked seats:', err);
    res.status(500).json({ message: 'Error fetching booked seats', error: err.message });
  }
};
createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, time, seats } = req.body;

    if (!showId || !time || !seats?.length) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    const show = await Show.findById(showId).populate("movie");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const existing = await Booking.findOne({
      show: showId,
      time,
      seats: { $in: seats }
    });
    if (existing) {
      return res.status(409).json({ message: "Some seats already booked" });
    }

    const booking = await Booking.create({
      user: userId,
      show: show._id,
      movie: show.movie._id,
      date: show.date,
      time,
      seats,
      amount: seats.length * show.price // <-- FIXED
    });

    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Booking failed", error: err.message });
  }
};

// Corrected function name
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId }).populate('show');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user bookings', error: err.message });
  }
};

const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate({
        path: 'show',
        populate: { path: 'movie', select: 'title language genre' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate({
        path: 'show',
        populate: { path: 'movie', model: 'Movie' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

const lockShowSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingBookings = await Booking.find({ show: showId }).select("seats");
    const bookedSeats = existingBookings.flatMap((b) => b.seats);
    const alreadyBookedOverlap = seats.filter(s => bookedSeats.includes(s));
    if (alreadyBookedOverlap.length > 0) {
      return res.status(409).json({ message: "Some seats are already permanently booked.", bookedSeats: alreadyBookedOverlap });
    }

    const result = await Show.updateOne(
      { _id: showId, lockedSeats: { $nin: seats } },
      { $addToSet: { lockedSeats: { $each: seats } } }
    );

    if (result.modifiedCount === 0 && result.matchedCount > 0) {
      const currentShow = await Show.findById(showId).select('lockedSeats');
      const actualOverlap = seats.filter(s => currentShow.lockedSeats.includes(s));
      if (actualOverlap.length > 0) {
        return res.status(409).json({ message: "Some seats are already held by another user.", lockedSeats: actualOverlap });
      }
      return res.status(400).json({ message: "Could not lock all seats, some might be unavailable." });
    }
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Show not found." });
    }

    setTimeout(async () => {
      await Show.updateOne(
        { _id: showId },
        { $pullAll: { lockedSeats: seats } }
      ).catch(err => console.error(`Error auto-releasing seats for show ${showId}:`, err));
      console.log(`Auto-released seats ${seats.join(', ')} for show ${showId}`);
    }, 5 * 60 * 1000); // 5 minutes

    return res.json({ message: "Seats locked successfully" });
  } catch (err) {
    console.error("Error locking seats:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const getLockedSeatsHandler = async (req, res) => {
  try {
    const { showId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({ message: 'Invalid show ID' });
    }

    const show = await Show.findById(showId).select('lockedSeats');
    const locked = show ? show.lockedSeats : [];
    return res.json({ lockedSeats: locked });
  } catch (err) {
    console.error("Error fetching locked seats:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const releaseShowSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Show.updateOne(
      { _id: showId },
      { $pullAll: { lockedSeats: seats } }
    );
    return res.json({ message: 'Seats released successfully' });
  } catch (err) {
    console.error("Error releasing seats:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const generateTicketPDF = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("show");
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const show = booking.show;
    const movie = await Movie.findById(show.movie);
    if (!movie) return res.status(404).json({ error: "Movie not found for this show" });

    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-${booking._id}.pdf"`,
      });
      res.send(pdfData);
    });

    doc.fontSize(20).text("🎟 Movie Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Booking ID: ${booking._id}`);
    doc.text(`Movie: ${movie.title}`);
    doc.text(`Show Date: ${new Date(show.date).toDateString()}`);
    doc.text(`Time: ${booking.time}`);
    doc.text(`Seats: ${booking.seats.join(", ")}`);
    doc.text(`Amount Paid: ₹${booking.amount}`);
    doc.text(`Booking Time: ${new Date(booking.createdAt).toLocaleString()}`);

    doc.moveDown();

    const qrCodeDataURL = await QRCode.toDataURL(booking._id.toString());
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, "base64");

    doc.image(qrBuffer, { fit: [150, 150], align: "center" });

    doc.end();
  } catch (error) {
    console.error("❌ PDF Ticket Error:", error);
    res.status(500).json({ error: "Failed to generate ticket PDF" });
  }
};

// Export all
module.exports = {
  getBookedSeats,
  createBooking,
  getUserBookings, // Corrected function name
  getMyBookings,
  getAllBookings,
  getAllBookingsForAdmin,
  lockShowSeats,
  getLockedSeatsHandler,
  releaseShowSeats,
  generateTicketPDF
};
