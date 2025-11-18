// backend/middleware/protectAdmin.js
module.exports = (req, res, next) => {
  try {
    const user = req.user;

    // If using Clerk public metadata
    if (user && user.publicMetadata && user.publicMetadata.role === 'admin') {
      return next();
    }

    // Or if you are storing user roles in DB
    // const dbUser = await User.findOne({ clerkId: user.sub });
    // if (dbUser && dbUser.role === 'admin') { ... }

    return res.status(403).json({ message: 'Access denied: Admins only' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin access', error: error.message });
  }
};
