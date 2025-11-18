const { verifyToken } = require("@clerk/backend"); // Make sure you have @clerk/backend installed
require("dotenv").config();

async function clerkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");

    // Verify the token using Clerk backend SDK
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.user = payload; // payload.sub is the userId
    next();
  } catch (error) {
    console.error("Clerk auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = clerkAuth;
