const { createLogger, format, transports } = require('winston');

// Logger configuration
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'info', // Log level based on environment
  format: format.combine(
    format.timestamp(), // Add a timestamp to logs
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/errors.log', level: 'error' }), // Log errors to a file
    new transports.File({ filename: 'logs/combined.log' }) // Log all messages to a file
  ],
});

module.exports = logger;
