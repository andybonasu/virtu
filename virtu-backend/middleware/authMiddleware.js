const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token format incorrect.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next(); // Proceed
  } catch (error) {
    return res.status(403).json({ error: error.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.' });
  }
};

module.exports = { authenticateToken };
