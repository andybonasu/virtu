const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/trainers/pending', authenticate, requireAdmin, adminController.getPendingTrainers);
router.put('/trainers/:id/approve', authenticate, requireAdmin, adminController.approveTrainer);
router.get('/admin/users', authenticate, requireAdmin, adminController.getAllUsers);
router.put('/admin/users/:id/disable', authenticate, requireAdmin, adminController.disableUser);
router.delete('/admin/users/:id', authenticate, requireAdmin, adminController.deleteUser);


module.exports = router;
