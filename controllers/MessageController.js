const MessageService = require('../services/MessageService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/messages_media');
  },
  filename: function (req, file, cb) {
    // Generate nama file unik dengan timestamp
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Pastikan direktori media ada
const mediaDir = 'media/messages_media';
if (!fs.existsSync(mediaDir)){
    fs.mkdirSync(mediaDir, { recursive: true });
}

class MessageController {
  static async createMessage(req, res) {
    upload.single('media_url')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return sendErrorResponse(res, 'Error processing form data: ' + err.message, 400);
      }

      try {
        console.log('Request body:', req.body);
        console.log('File:', req.file);

        const { sender_id, receiver_id, message_content, message_type = 'text' } = req.body;
        
        if (!sender_id || !receiver_id) {
          return sendErrorResponse(res, 'sender_id and receiver_id are required', 400);
        }

        const messageData = {
          sender_id: parseInt(sender_id),
          receiver_id: parseInt(receiver_id),
          message_content: message_content || '',
          message_type: req.file ? 'image' : message_type,
          status: 'sent'
        };

        // Simpan hanya nama file saja
        if (req.file) {
          messageData.media_url = req.file.filename;
        }

        const messageId = await MessageService.createMessage(messageData);
        sendSuccessResponse(res, { messageId }, 201);
      } catch (error) {
        console.error('Create message error:', error);
        sendErrorResponse(res, `Failed to create message: ${error.message}`, 400);
      }
    });
  }

  static async getMessageById(req, res) {
    try {
      const message = await MessageService.getMessageById(req.params.messageId);
      if (message) {
        sendSuccessResponse(res, message);
      } else {
        sendErrorResponse(res, 'Message not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, 'Failed to get message', 500);
    }
  }

  static async getUserMessages(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const messages = await MessageService.getUserMessages(userId, page, limit);
      sendSuccessResponse(res, messages);
    } catch (error) {
      sendErrorResponse(res, 'Failed to get user messages', 500);
    }
  }

  static async updateMessage(req, res) {
    upload.single('media_url')(req, res, async (err) => {
      if (err) {
        return sendErrorResponse(res, 'Error processing form data: ' + err.message, 400);
      }

      try {
        const messageId = req.params.messageId;
        const messageData = { ...req.body };

        if (req.file) {
          // Hapus file lama jika ada
          const oldMessage = await MessageService.getMessageById(messageId);
          if (oldMessage && oldMessage.media_url) {
            const oldFilePath = path.join(mediaDir, oldMessage.media_url);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          }

          // Simpan hanya nama file baru
          messageData.media_url = req.file.filename;
          messageData.message_type = 'image';
        }

        const updated = await MessageService.updateMessage(messageId, messageData);
        if (updated) {
          sendSuccessResponse(res, { message: 'Message updated successfully' });
        } else {
          sendErrorResponse(res, 'Message not found', 404);
        }
      } catch (error) {
        console.error('Update message error:', error);
        sendErrorResponse(res, 'Failed to update message', 500);
      }
    });
  }

  static async deleteMessage(req, res) {
    try {
      const messageId = req.params.messageId;
      
      // Hapus file media jika ada
      const message = await MessageService.getMessageById(messageId);
      if (message && message.media_url) {
        const filePath = path.join(mediaDir, message.media_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const deleted = await MessageService.deleteMessage(messageId);
      if (deleted) {
        sendSuccessResponse(res, { message: 'Message deleted successfully' });
      } else {
        sendErrorResponse(res, 'Message not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, 'Failed to delete message', 500);
    }
  }

  static async getMessagesBetweenUsers(req, res) {
    try {
      const { userId1, userId2 } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const messages = await MessageService.getMessagesBetweenUsers(userId1, userId2, page, limit);
      sendSuccessResponse(res, messages);
    } catch (error) {
      sendErrorResponse(res, 'Failed to get messages between users', 500);
    }
  }

  static async markMessageAsRead(req, res) {
    try {
      const { messageId } = req.params;
      const updated = await MessageService.markMessageAsRead(messageId);
      
      if (updated) {
        sendSuccessResponse(res, { message: 'Message marked as read' });
      } else {
        sendErrorResponse(res, 'Message not found', 404);
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      sendErrorResponse(res, 'Failed to mark message as read', 500);
    }
  }
}

module.exports = MessageController;
