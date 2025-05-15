const express = require('express');
const router = express.Router();
const publicCourseController = require('../controllers/publicCourseController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Trainer submits listing
router.post('/publicCourses', authenticate, publicCourseController.submitPublicCourse);

// Public access
router.get('/publicCourses/:id', publicCourseController.getPublicCourseById);

// Admin review
router.get('/admin/publicCourses/pending', authenticate, requireAdmin, publicCourseController.getPendingPublicCourses);
router.put('/admin/publicCourses/:id/approve', authenticate, requireAdmin, publicCourseController.approvePublicCourse);
router.put('/admin/publicCourses/:id/reject', authenticate, requireAdmin, publicCourseController.rejectPublicCourse);

// Trainer’s own listing
router.get('/publicCourses/me', authenticate, publicCourseController.getMyPublicCourse);

module.exports = router;
