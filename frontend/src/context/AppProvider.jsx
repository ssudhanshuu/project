// src/context/AppProvider.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import AppContext from "./AppContext";

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// AppProvider Component
const AppProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Admin States
  const [dashboardData, setDashboardData] = useState(null);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);

  // User States
  const [myBookings, setMyBookings] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Get Authorization Header
  const getAuthHeaders = async () => {
    try {
      const token = await getToken();  // Fetch token from Clerk
      return {
        Authorization: `Bearer ${token}`,
      };
    } catch (err) {
      console.error("Error getting token:", err);
      return {};  // Return empty if no token available
    }
  };

  // ADMIN Fetches
  const fetchDashboard = async () => {
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.get(`${API_URL}/api/admin/dashboard`, { headers });
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const fetchShows = async () => {
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.get(`${API_URL}/api/admin/shows`, { headers });
      setShows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Shows fetch error:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.get(`${API_URL}/api/admin/bookings`, { headers });
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Bookings fetch error:", err);
    }
  };

  const fetchMovies = async () => {
    try {
      
       const { data } = await axios.get(`${API_URL}/api/movies`);
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Movies fetch error:", err);
      setMovies([]);
    }
  };

  const addShow = async (showData) => {
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.post(`${API_URL}/api/admin/shows`, showData, { headers });
      setShows((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Add show error:", err);
    }
  };

  // USER Fetches
  const fetchAllMovies = async () => {
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.get(`${API_URL}/api/movies`, { headers });

      // Combine both movie arrays
      const combinedMovies = [...(data.movies || []), ...(data.tmdbMovies || [])];
      setAllMovies(combinedMovies);
    } catch (err) {
      console.error("All movies fetch error:", err.response?.data || err.message);
      setAllMovies([]);
    }
  };

  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      const headers = await getAuthHeaders(); // Await the result of getAuthHeaders
      const { data } = await axios.get(`${API_URL}/api/bookings/${user.id}`, { headers });
      setMyBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("My bookings fetch error:", err.response?.data || err.message);
      setMyBookings([]);
    }
  };

  // Auto Fetch When Logged In
  useEffect(() => {
    if (isLoaded) {
      fetchAllMovies();
      fetchMovies();
      fetchDashboard();
      fetchShows();
      fetchBookings();
      fetchMyBookings();
    }
  }, [isLoaded]);

  return (
    <AppContext.Provider
      value={{
        // Admin
        dashboardData,
        shows,
        bookings,
        movies,
        addShow,
        fetchShows,
        fetchBookings,
        fetchMovies,
        fetchDashboard,

        // User
        myBookings,
        allMovies,
        fetchMyBookings,
        fetchAllMovies,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider; // Default export
