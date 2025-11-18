// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { clerkMiddleware } = require('@clerk/express');

const connectDB = require('./config/db');
const movieRoutes = require('./routers/movieRoutes');
const showRoutes = require('./routers/ShowRouters');
const bookingRoutes = require('./routers/bookingRouters');
const adminRoutes = require('./routers/adminRoutes');
const userRoutes = require('./routers/userRouters');
const seatRoutes = require('./routers/seatRouters');
const favoriteRoutes = require("./routers/favoriteRoutes");
const theaterRoutes = require("./routers/theaterRoutes");
const paymentRoutes = require('./routers/paymentRoutes');

const { serve } = require("inngest/express");
const { inngest, syncUserCreation } = require("./inngest");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(clerkMiddleware());

// Regular routes
app.use('/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/user/favorites", favoriteRoutes);
app.use("/api/admin/theaters", theaterRoutes);

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions: [syncUserCreation] }));

app.get('/', (req, res) => {
  res.send('🎬 Movie Ticket Backend is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
