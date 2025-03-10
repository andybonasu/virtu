const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize"); // ✅ Import existing function
const {
  getPendingTrainers,
  approveTrainer,
  rejectTrainer,
  getAllApprovedTrainers,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/adminController");

const router = express.Router();

// ✅ 1. Get all pending trainers (Admin Only)
router.get("/trainers/pending", authenticateToken, authorize("admin"), getPendingTrainers);

// ✅ 2. Approve a trainer (Admin Only)
router.put("/trainers/:id/approve", authenticateToken, authorize("admin"), approveTrainer);

// ✅ 3. Reject a trainer (Admin Only)
router.put("/trainers/:id/reject", authenticateToken, authorize("admin"), rejectTrainer);

// ✅ 4. Get all approved trainers (Admin Only)
router.get("/trainers", authenticateToken, authorize("admin"), getAllApprovedTrainers);

// ✅ 5. Get all users (Admin Only)
router.get("/users", authenticateToken, authorize("admin"), getAllUsers);

// ✅ 6. Get user by ID (Admin Only)
router.get("/users/:id", authenticateToken, authorize("admin"), getUserById);

// ✅ 7. Delete a user (Admin Only - Soft Delete)
router.delete("/users/:id", authenticateToken, authorize("admin"), deleteUser);

module.exports = router;
