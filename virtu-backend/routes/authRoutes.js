const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/users/me', authenticate, authController.getMe);
router.put('/users/:id', authenticate, authController.updateUser);
router.post('/auth/add-admin', authController.addAdmin);


module.exports = router;
