const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');
const { jwtSecret } = require('../config/env');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1]) ||
    req.cookies?.token;

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const decoded = jwt.verify(token, jwtSecret);
  const user = await User.findById(decoded.id).select('-password');

  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(`Role (${req.user.role}) is not allowed to access this resource`, 403);
    }
    next();
  };
};

module.exports = { protect, authorize, authenticate: protect };
