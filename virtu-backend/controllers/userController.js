const { User } = require("../models");
const bcrypt = require("bcrypt");

// ✅ Fetch all users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "approvalStatus"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users." });
  }
};

// ✅ Fetch current logged-in user's profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "approvalStatus"],
    });
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile." });
  }
};

// ✅ Fetch user by ID (Admin & Self Only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "role", "approvalStatus"],
    });
    if (!user) return res.status(404).json({ error: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user." });
  }
};

// ✅ Update user (Self & Admin Only)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Prevent users from changing role or approval status
    const { role, approvalStatus, password, ...updateFields } = req.body;

    // Hash new password if provided
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateFields);
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user." });
  }
};

// ✅ Soft Delete User (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Soft delete: Set approvalStatus to 'deleted' instead of removing user
    await user.update({ approvalStatus: "deleted" });

    res.status(200).json({ message: "User deleted (soft delete applied)." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};

module.exports = { getAllUsers, getCurrentUser, getUserById, updateUser, deleteUser };
