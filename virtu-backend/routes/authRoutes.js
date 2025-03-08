const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, logout, refreshToken } = require('../controllers/authController');

const router = express.Router();

// ✅ Login Rate Limiter (5 attempts per 5 minutes)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Only 5 login attempts per IP
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip, // Track requests per IP
  handler: (req, res) => {
    // console.log(`🔴 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many login attempts, please try again later.' });
  }
});

// ✅ Apply rate limiter **before** the login function
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

module.exports = router;
