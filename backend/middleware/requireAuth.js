const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Clerk token verify
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY);
    req.user = decoded; // isme userId hota hai
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = requireAuth;
