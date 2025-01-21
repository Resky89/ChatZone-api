const express = require('express');
const ChatController = require('../controllers/ChatController');

const router = express.Router();

// Create a new chat
router.post('/chat/create', ChatController.createChat);

// Get chats for a specific user (with pagination)
router.get('/chat/user/:userId', ChatController.getUserChats);

// Update a chat
router.put('/chat/:chatId', ChatController.updateChat);

// Delete a chat
router.delete('/chat/:chatId', ChatController.deleteChat);


module.exports = router;
