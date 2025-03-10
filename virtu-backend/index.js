require('dotenv').config(); // Load environment variables

const express = require('express');
const morgan = require('morgan');
const sequelize = require('./db'); // Import Sequelize instance
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Ensure auth routes are included
const courseRoutes = require('./routes/courseRoutes'); // Import Course routes
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger'); // Import Winston logger
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Ensure Express Trusts Reverse Proxies (Fix for IP detection)
app.set('trust proxy', 1);

// ✅ Configure Global Rate Limiter (for non-auth routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: false,
  legacyHeaders: false,
});

// ✅ Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log incoming requests

// ✅ Log each incoming request (Commented out)
/*
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url} from IP: ${req.ip}`);
  next();
});
*/

// ✅ Apply global rate limiter **only to non-auth routes**
app.use('/api/v1/users', generalLimiter, userRoutes);

// ✅ Use separate route for authentication **without the global limiter**
app.use('/api/v1/auth', authRoutes); // 🛑 FIXED: Now auth routes won't be affected by global rate limiter
app.use('/api/v1/courses', courseRoutes); // ✅ Register Course Management APIs
app.use("/api/v1/admin", adminRoutes);
// ✅ Health check route (Commented out)
/*
app.get('/health', (req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'OK', message: 'Server is running.' });
});
*/

// ✅ Error-handling middleware
app.use(errorHandler);

// ✅ Sync database (Commented out logs)
/*
sequelize
  .sync({ alter: true }) // Adjust tables without dropping them
  .then(() => logger.info('Database synced successfully!'))
  .catch((err) => logger.error(`Error syncing database: ${err.message}`));
*/

// ✅ Start the server (Commented out logs)
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
