// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware: Verify JWT Token from Authorization Header or Cookie
 * Extracts decoded user payload and attaches it to req.user
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Extract token from Bearer scheme
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication token missing or invalid.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'chargeup_super_secret_jwt_key_2026';
    const decodedPayload = jwt.verify(token, secret);
    
    // Attach user payload to request object
    req.user = decodedPayload;
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message);
    return res.status(403).json({
      success: false,
      error: 'Invalid, corrupted, or expired token. Please sign in again.'
    });
  }
};

/**
 * Role-based Authorization Middleware
 * @param  {...string} allowedRoles - List of authorized roles ('driver', 'station_owner', 'admin')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: User role '${req.user?.role || 'unknown'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authenticateToken: authenticateJWT, // Alias for backward compatibility
  authorizeRoles
};