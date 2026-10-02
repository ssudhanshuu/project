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
const theaterMovieRoutes = require("./routers/theaterMovieRoutes");
const paymentRoutes = require('./routers/paymentRoutes');

const { serve } = require("inngest/express");
const { inngest, syncUserCreation } = require("./inngest");

dotenv.config();
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://project-kappa-rust-86.vercel.app",
  "https://project-git-main-sudhanshus-projects-51fc09f7.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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
app.use("/api/theater-movies", theaterMovieRoutes);

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions: [syncUserCreation] }));

app.get('/', (req, res) => {
  res.send('🎬 Movie Ticket Backend is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
