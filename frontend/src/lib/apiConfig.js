// src/lib/apiConfig.js
// ─── Single source of truth for API base URL ──────────────────────────────────
// In development:  VITE_API_URL = http://localhost:3000
// In production:   VITE_API_URL = https://project-wd9n.onrender.com
//
// This file should be imported wherever an API URL is needed.
// Do NOT hardcode localhost or production URLs anywhere else.

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
