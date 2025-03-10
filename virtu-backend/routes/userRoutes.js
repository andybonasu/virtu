const express = require("express");
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

const router = express.Router();

// ✅ Get current user's profile (Clients & Trainers)
router.get("/me", authenticateToken, getCurrentUser);

// ✅ Update current user's profile (Clients & Trainers)
router.put(
  "/me",
  authenticateToken,
  validate([
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ]),
  updateUser
);

// ✅ Admin-only route to fetch all users
router.get("/", authenticateToken, authorize(["admin"]), getAllUsers);

// ✅ Fetch user by ID (Admin & the user themselves)
router.get("/:id", authenticateToken, (req, res, next) => {
  if (req.user.role === "admin" || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: "Access denied." });
}, getUserById);

// ✅ Admin-only route to delete a user (Soft Delete)
router.delete("/:id", authenticateToken, authorize(["admin"]), deleteUser);

module.exports = router;
