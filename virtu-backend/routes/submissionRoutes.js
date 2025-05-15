const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/sections/:id/submit', authenticate, submissionController.submitResponse);
router.get('/sections/:id/submission/:clientId', authenticate, submissionController.getSubmission);
router.put('/submissions/:id', authenticate, submissionController.updateSubmission);

module.exports = router;
