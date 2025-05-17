const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticate } = require('../middleware/authMiddleware');

// Sections
router.post('/assignedCourses/:id/sections', authenticate, contentController.addSectionToAssignedCourse);
router.get('/assignedCourses/:id/sections', authenticate, contentController.getSectionsForAssignedCourse);
router.put('/sections/:id', authenticate, contentController.updateSection); // 🆕 Update section
router.put('/assignedCourses/:id/sections/reorder', authenticate, contentController.reorderSections); // 🆕 Reorder sections
router.delete('/sections/:id', authenticate, contentController.deleteSection); // 🆕 Delete section

// Blocks
router.post('/sections/:id/blocks', authenticate, contentController.addBlockToSection);
router.get('/sections/:id/blocks', authenticate, contentController.getBlocksForSection);
router.put('/blocks/:id', authenticate, contentController.updateBlock);
router.delete('/blocks/:id', authenticate, contentController.deleteBlock);

module.exports = router;
