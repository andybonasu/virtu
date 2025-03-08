const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { login, logout, refreshToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize'); // RBAC middleware
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

// Auth routes (public)
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refreshToken);

// User routes

// Admin-only route to fetch all users
router.get('/', authenticateToken, authorize(['admin']), getAllUsers); // Protected, admin-only

// Fetch user by ID (accessible by admin and the user themselves)
router.get('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied.' });
}, getUserById);

// Admin-only route to create a new user
router.post(
  '/',
  authenticateToken,
  authorize(['admin']), // Only admins can create users
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['admin', 'trainer', 'client']).withMessage('Role must be admin, trainer, or client'),
  ]),
  createUser
);

// Update a user (accessible by admin and the user themselves)
router.put('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: 'Access denied.' });
}, updateUser);

// Admin-only route to delete a user
router.delete('/:id', authenticateToken, authorize(['admin']), deleteUser); // Protected, admin-only

module.exports = router;
