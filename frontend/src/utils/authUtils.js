// src/utils/authUtils.js

// This function will return the headers with the Bearer token for authenticated requests.
export const getAuthHeaders = (token) => {
  if (!token) {
    console.error("No authentication token found");
    return {};
  }

  // Return the Authorization header with the Bearer token
  return {
    Authorization: `Bearer ${token}`,  // Use the passed token here
  };
};
