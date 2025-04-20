const { verifyToken } = require('../utils/jwtUtils');
const { User } = require('../models');

// Middleware to authenticate JWT token
exports.authenticate = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    // Check if auth header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const { valid, expired, userId } = verifyToken(token);
    
    // Handle invalid token
    if (!valid) {
      return res.status(401).json({ 
        message: expired ? 'Your session has expired. Please log in again.' : 'Invalid authentication token.' 
      });
    }
    
    // Get user from database
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Don't include password in response
    });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }
    
    // Attach user to request object
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
}; 