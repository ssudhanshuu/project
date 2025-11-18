
const User = require('../models/User');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

exports.getDashboardData = async (req, res) => {
  try {
    
    const dashboardData = {
      totalUsers: 100,
      totalBookings: 250,
      totalRevenue: 50000,
      activeShows: 20,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


exports.getAdminDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const bookings = await Booking.find();
   const totalRevenue = bookings.reduce((acc, booking) => acc + (booking.amount || 0), 0);

    const activeShows = await Show.find({ isActive: true }).countDocuments();
      const activeShow = await Show.find({ isActive: true })
        .populate('movie')
        .sort({ createdAt: -1 })
        .limit(7);
    res.status(200).json({
      totalUsers,
      totalBookings,
      totalRevenue,
      activeShows,
      activeShow,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
};
