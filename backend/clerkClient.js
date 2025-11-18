// backend/clerkClient.js
const { createClerkClient } = require("@clerk/backend");

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY, // .env me Clerk ka secret key rakho
});

module.exports = clerkClient;
