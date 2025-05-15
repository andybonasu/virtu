const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// Common
router.get('/conversations/user/:id', authenticate, chatController.getUserConversations);
router.post('/conversations', authenticate, chatController.startConversation);
router.get('/messages/:conversationId', authenticate, chatController.getMessages);
router.post('/messages', authenticate, chatController.sendMessage);
router.put('/messages/:id/read', authenticate, chatController.markMessageRead);

// Admin-specific
router.get('/admin/conversations', authenticate, requireAdmin, chatController.getAllConversations);
router.get('/admin/messages/:userId', authenticate, requireAdmin, chatController.getMessagesByUser);
router.get('/admin/users/search', authenticate, requireAdmin, chatController.searchUsers);
router.post('/admin/messages/start', authenticate, requireAdmin, chatController.adminStartMessage);

module.exports = router;
