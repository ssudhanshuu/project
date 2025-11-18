const express = require('express');
const { clerkMiddleware, requireAuth } = require('@clerk/express'); // ✅ Import Clerk's middleware

const router = express.Router();

// Get current user's details (Protected)
router.get('/me', clerkMiddleware(), requireAuth(), (req, res) => {
  // req.auth contains the authentication details from Clerk
  // req.auth.userId is the Clerk user ID
  res.json({
    userId: req.auth.userId,
    // You can fetch more user details from Clerk if needed,
    // or if you have a local User model linked to Clerk ID
    // For example: req.auth.user.emailAddresses[0].emailAddress
    // or if you populate req.user with more details in a custom middleware
  });
});

module.exports = router;
