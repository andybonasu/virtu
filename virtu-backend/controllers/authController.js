const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const logger = require("../utils/logger"); // Import Winston logger

// ✅ Client Signup (Auto-Verified)
const signupClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client (auto-verified)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
      isVerified: true,
      approvalStatus: "approved",
    });

    logger.info(`New client registered: ${email}`);
    res.status(201).json({ message: "Client registered successfully.", userId: newUser.id });
  } catch (error) {
    logger.error(`Client signup failed for ${req.body.email}: ${error.message}`);
    res.status(500).json({ error: "Client signup failed." });
  }
};

// ✅ Trainer Signup (Requires Admin Approval)
const signupTrainer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create trainer (pending approval)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
      isVerified: false, // Trainer must be approved by Admin
      approvalStatus: "pending",
    });

    logger.info(`New trainer registered (awaiting approval): ${email}`);
    res.status(201).json({ message: "Trainer registered successfully. Awaiting admin approval.", userId: newUser.id });
  } catch (error) {
    logger.error(`Trainer signup failed for ${req.body.email}: ${error.message}`);
    res.status(500).json({ error: "Trainer signup failed." });
  }
};

// ✅ Login user
const login = async (req, res) => {
  try {
    console.log(`Processing login attempt for ${req.body.email} from IP: ${req.ip}`);

    const { email, password } = req.body;

    // Check if rate limiter headers exist in the response
   // console.log(`RateLimit-Limit: ${res.get('RateLimit-Limit')}`);
   // console.log(`RateLimit-Remaining: ${res.get('RateLimit-Remaining')}`);
   // console.log(`RateLimit-Reset: ${res.get('RateLimit-Reset')}`);
   
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Login attempt failed: User with email ${email} not found from IP: ${req.ip}`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare plaintext password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login attempt failed: Incorrect password for email ${email} from IP: ${req.ip}`);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // ❌ Check if trainer is approved before allowing login
    if (user.role === "trainer" && user.approvalStatus !== "approved") {
      logger.warn(`Login blocked: Trainer ${email} is not approved yet.`);
      return res.status(403).json({ error: "Trainer account is pending approval." });
    }

    // Generate JWT tokens
    const token = jwt.sign(
      { id: user.id, role: user.role, approvalStatus: user.approvalStatus },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    logger.info(`User with email ${email} logged in successfully from IP: ${req.ip}`);
    res.status(200).json({ token, refreshToken });
  } catch (error) {
    logger.error(`Login failed for email ${req.body.email} from IP: ${req.ip}: ${error.message}`);
    res.status(500).json({ error: "Login failed." });
  }
};

// ✅ Logout user
const logout = (req, res) => {
  logger.info(`User logged out successfully from IP: ${req.ip}`);
  res.status(200).json({ message: "Logged out successfully." });
};

// ✅ Refresh token
const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    logger.warn(`Refresh token request failed: Missing refresh token from IP: ${req.ip}`);
    return res.status(400).json({ error: "Missing refresh token." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // ✅ Ensure new token includes role & approvalStatus
    const user = User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token." });
    }

    const newToken = jwt.sign(
      { id: user.id, role: user.role, approvalStatus: user.approvalStatus },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info(`Refresh token issued for user ID ${decoded.id} from IP: ${req.ip}`);
    res.status(200).json({ token: newToken });
  } catch (error) {
    logger.error(`Refresh token failed from IP: ${req.ip}: ${error.message}`);
    res.status(403).json({ error: "Invalid refresh token." });
  }
};

module.exports = { signupClient, signupTrainer, login, logout, refreshToken };



