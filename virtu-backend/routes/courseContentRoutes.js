const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate } = require('../middleware/authMiddleware');

// Sections
router.post('/assignedCourses/:id/sections', authenticate, contentController.addSectionToAssignedCourse);
router.get('/assignedCourses/:id/sections', authenticate, contentController.getSectionsForAssignedCourse);

// Blocks
router.post('/sections/:id/blocks', authenticate, contentController.addBlockToSection);
router.get('/sections/:id/blocks', authenticate, contentController.getBlocksForSection);
router.put('/blocks/:id', authenticate, contentController.updateBlock);
router.delete('/blocks/:id', authenticate, contentController.deleteBlock);

module.exports = router;
