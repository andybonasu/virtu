const express = require("express");
const rateLimit = require("express-rate-limit");
const { signupClient, signupTrainer, login, logout, refreshToken } = require("../controllers/authController");

const router = express.Router();

// ✅ Login Rate Limiter (5 attempts per 5 minutes)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Only 5 login attempts per IP
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip, // Track requests per IP
  handler: (req, res) => {
    res.status(429).json({ error: "Too many login attempts, please try again later." });
  },
});

// ✅ Client Signup (Auto-Verified)
router.post("/signup/client", signupClient);

// ✅ Trainer Signup (Requires Admin Approval)
router.post("/signup/trainer", signupTrainer);

// ✅ Apply rate limiter **before** the login function
router.post("/login", loginLimiter, login);

// ✅ Logout API
router.post("/logout", logout);

// ✅ Refresh Token API
router.post("/refresh", refreshToken);

module.exports = router;
