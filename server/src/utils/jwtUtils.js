const jwt = require('jsonwebtoken');

// Secret key for JWT - in production, load from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
exports.generateToken = (user) => {
  // Create payload with user id and role
  const payload = {
    userId: user.id,
    role: user.role
  };
  
  // Generate token with 24 hour expiration
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, expired: false, userId: decoded.userId, role: decoded.role };
  } catch (error) {
    // Handle expired token
    if (error.name === 'TokenExpiredError') {
      return { valid: false, expired: true, userId: null, role: null };
    }
    // Handle invalid token
    return { valid: false, expired: false, userId: null, role: null };
  }
}; 