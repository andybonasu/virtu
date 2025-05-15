const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Base course (Trainer)
router.post('/courses', authenticate, courseController.createBaseCourse);
router.get('/courses/:id', authenticate, courseController.getBaseCourseById);
router.get('/courses/trainer/:trainerId', authenticate, courseController.getTrainerCourses);

// Assigned course (Admin & Trainer)
router.post('/assignedCourses', authenticate, requireAdmin, courseController.assignCourseToClient);
router.get('/assignedCourses/client/:clientId', authenticate, courseController.getAssignedCourseByClientId);
router.put('/assignedCourses/:id', authenticate, courseController.updateAssignedCourse);

//get client list 
router.get('/trainer/clients', authenticate, courseController.getTrainerClients);
//get assigned trainer info
router.get('/clients/:clientId/trainer', authenticate, courseController.getTrainerForClient);


module.exports = router;
