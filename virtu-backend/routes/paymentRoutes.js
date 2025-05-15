const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.post('/payments/initiate', authenticate, paymentController.initiatePayment);
router.post('/payments/confirm', paymentController.confirmPayment);

router.get('/payments/client/:id', authenticate, paymentController.getClientPayments);
router.get('/payments/trainer/:id', authenticate, paymentController.getTrainerPayments);
router.get('/admin/payments', authenticate, requireAdmin, paymentController.getAllPayments);

module.exports = router;
