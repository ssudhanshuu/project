const { clerkClient } = require('@clerk/express');

const protectAdmin = async (req, res, next) => {
  try {
    // Clerk Express middleware ke baad userId yahan milta hai
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await clerkClient.users.getUser(userId);

    // Public metadata ya custom metadata se check karo
    if (!user.publicMetadata?.isAdmin) {
      return res.status(403).json({ message: 'Admins only' });
    }

    next();
  } catch (error) {
    console.error('protectAdmin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = protectAdmin;
