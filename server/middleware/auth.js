const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await pool.query(
        'SELECT user_id, email, role, first_name, last_name, is_active FROM users WHERE user_id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      if (!rows[0].is_active) {
        return res.status(403).json({ success: false, message: 'User account is deactivated' });
      }

      req.user = rows[0];
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
