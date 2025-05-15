const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.get('/trainers/pending', authenticate, requireAdmin, adminController.getPendingTrainers);
router.put('/trainers/:id/approve', authenticate, requireAdmin, adminController.approveTrainer);

module.exports = router;
