const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack); // Log full error stack
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
