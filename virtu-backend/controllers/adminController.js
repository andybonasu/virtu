const { User } = require("../models");

// ✅ 1. Get all pending trainers
exports.getPendingTrainers = async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: { role: "trainer", approvalStatus: "pending" },
      attributes: ["id", "email", "name", "expertise", "approvalStatus"],
    });

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending trainers." });
  }
};

// ✅ 2. Approve a trainer
exports.approveTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await User.findByPk(id);

    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ error: "Trainer not found." });
    }

    trainer.approvalStatus = "approved";
    trainer.isVerified = true;
    await trainer.save();

    res.json({ message: "Trainer approved successfully.", trainerId: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve trainer." });
  }
};

// ✅ 3. Reject a trainer
exports.rejectTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const trainer = await User.findByPk(id);

    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ error: "Trainer not found." });
    }

    trainer.approvalStatus = "rejected";
    trainer.rejectionReason = rejectionReason || "No reason provided";
    await trainer.save();

    res.json({ message: "Trainer rejected.", trainerId: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject trainer." });
  }
};

// ✅ 4. Get all approved trainers
exports.getAllApprovedTrainers = async (req, res) => {
  try {
    const trainers = await User.findAll({
      where: { role: "trainer", approvalStatus: "approved" },
      attributes: ["id", "email", "name", "expertise"],
    });

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch approved trainers." });
  }
};

// ✅ 5. Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "name", "role", "approvalStatus"],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// ✅ 6. Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "email", "name", "role", "approvalStatus"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details." });
  }
};

// ✅ 7. Delete a user (Soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Soft delete: Set approvalStatus to 'deleted' instead of actual deletion
    user.approvalStatus = "deleted";
    await user.save();

    res.json({ message: "User deleted successfully.", userId: id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};
