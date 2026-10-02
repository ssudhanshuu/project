// src/lib/axiosInstance.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach Clerk auth token if available
axiosInstance.interceptors.request.use(async (config) => {
  try {
    // Clerk exposes session token through window.Clerk if you’re outside React
    if (window.Clerk) {
      const token = await window.Clerk.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.warn("Clerk token fetch failed:", err);
  }
  return config;
});

export default axiosInstance;
