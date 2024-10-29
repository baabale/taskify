const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticateUser = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorizeUser = (req, res, next) => {
  const userId = req.user.userId;

  User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  });
};
