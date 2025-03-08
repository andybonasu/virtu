const logger = require('../utils/logger');

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      if (!req.user) {
        logger.warn(`Unauthorized request: Missing user data.`);
        return res.status(401).json({ error: 'Unauthorized request.' });
      }

      if (!roles.includes(req.user.role)) {
        logger.warn(`Unauthorized access attempt by user ID ${req.user.id} with role ${req.user.role}`);
        return res.status(403).json({ error: 'Access denied.' });
      }

      next();
    } catch (error) {
      logger.error(`Authorization failed: ${error.message}`);
      res.status(500).json({ error: 'Internal server error during authorization.' });
    }
  };
};

module.exports = authorize;
