import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  useUser,
  SignIn,
  SignUp
} from "@clerk/clerk-react";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Favorite from "./pages/Favorite";
import MovieDetails from "./pages/MovieDetails";
import MyBooking from "./pages/MyBooking";
import SeatLayout from "./pages/SeatLayout";
import ContactUs from "./pages/ContactUs";
import FullDetails from "./pages/FullDetails";
import Releases from "./pages/Releases";
import { Toaster, toast } from "react-hot-toast";

import Dashboard from "./pages/admin/Dashboard";
import AddShow from "./pages/admin/Addshow";
import ListShow from "./pages/admin/ListShow";
import ListBookings from "./pages/admin/ListBookings";
import Layout from "./pages/admin/Layout";
import AddTheater from "./pages/admin/AddTheater";
import AddUpcomingMovie from "./pages/admin/AddUpcomingMovie";
import AssignMovieToTheater from "./pages/admin/AssignMovieToTheater";
import ListUpcomingMovies from "./pages/ListUpcomingMovies";
import Theaters from "./pages/Theaters";
import SuccessPage from "./pages/SuccessPage";
import FailurePage from "./pages/FailurePage";

import "./App.css";

export default function App() {
  const location = useLocation();
  const { user } = useUser();
  const isLoggedIn = !!user;
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const publicPaths = ["/", "/movies", "/contactus", "/movies/:id", "/releases"];
    const isPublic = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isLoggedIn && !isPublic) {
      toast.error("Please login to your account", { id: "auth-warning" });
    }
  }, [isLoggedIn, location.pathname]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <Toaster />
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow flex flex-col">
        <Routes>
          {/* Clerk Auth Routes */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<FullDetails />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/payment-success" element={<SuccessPage />} />
          <Route path="/payment-failure" element={<FailurePage />} />

          {/* User Routes */}
          {isLoggedIn && (
            <>
              <Route path="/movies/:id/:date" element={<SeatLayout />} />
              <Route path="/movies/:id/:date/:time" element={<SeatLayout />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/favorites" element={<Favorite />} />
              <Route path="/moviedetails" element={<MovieDetails />} />
              <Route path="/mybooking" element={<MyBooking />} />
              <Route path="/theaters" element={<Theaters />} />
              <Route path="/theaters/shows" element={<ListShow />} />
            </>
          )}

          {/* Admin Routes */}
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shows" element={<ListShow />} />
            <Route path="bookings" element={<ListBookings />} />
            <Route path="shows/add" element={<AddShow />} />
            <Route path="add-theaters" element={<AddTheater />} />
            <Route path="movies/add" element={<AddUpcomingMovie />} />
            <Route path="movies/upcoming" element={<ListUpcomingMovies />} />
            <Route path="assign-movies" element={<AssignMovieToTheater />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={<div className="text-center p-10 text-xl flex-grow flex items-center justify-center">404 - Page Not Found</div>}
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
