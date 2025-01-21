const express = require('express');
const MessageController = require('../controllers/MessageController');

const router = express.Router();

router.post('/message', MessageController.createMessage);
router.get('/message/:messageId', MessageController.getMessageById);
router.get('/messages/user/:userId', MessageController.getUserMessages);
router.put('/message/:messageId', MessageController.updateMessage);
router.delete('/message/:messageId', MessageController.deleteMessage);
router.get('/messages/between/:userId1/:userId2', MessageController.getMessagesBetweenUsers);
router.patch('/message/:messageId/read', MessageController.markMessageAsRead);

module.exports = router;
