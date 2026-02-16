const express = require('express');
const router = express.Router();


const {
    createWidget,
    getWidgets,
    getWidgetConfig,
    getConversations,
    getMessages,
    replyMessage
} = require('../controllers/chatController');

const { protect } = require('../middleware/authMiddleware');

// Widget Routes
router.post('/widgets', protect, createWidget);
router.get('/widgets', protect, getWidgets);
router.get('/widget-config/:token', getWidgetConfig); // Public for script

// Conversation Routes
router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/reply', protect, replyMessage);

module.exports = router;
