const MessageModel = require('../models/MessageModel');
const { validateMessage } = require('../validations/MessageValidation');
const { formatDate } = require('../helpers/data-formatter');

class MessageService {
  static async createMessage(messageData) {
    try {
      const { error } = validateMessage(messageData);
      if (error) throw new Error(error.details[0].message);

      // Set default values jika tidak ada
      messageData.status = messageData.status || 'sent';
      messageData.message_content = messageData.message_content || '';
      messageData.timestamp = formatDate(new Date());
      
      return await MessageModel.create(messageData);
    } catch (error) {
      console.error('MessageService createMessage error:', error);
      throw error;
    }
  }

  static async getMessageById(messageId) {
    const message = await MessageModel.findById(messageId);
    if (message) {
      message.timestamp = formatDate(message.timestamp);
    }
    return message;
  }

  static async getUserMessages(userId, page, limit) {
    const messages = await MessageModel.findByUserId(userId, page, limit);
    return messages.map(message => ({
      ...message,
      timestamp: formatDate(message.timestamp)
    }));
  }

  static async updateMessage(messageId, messageData) {
    const { error } = validateMessage(messageData);
    if (error) throw new Error(error.details[0].message);

    messageData.timestamp = formatDate(new Date());
    return await MessageModel.update(messageId, messageData);
  }

  static async deleteMessage(messageId) {
    return await MessageModel.delete(messageId);
  }

  static async getMessagesBetweenUsers(userId1, userId2, page, limit) {
    const messages = await MessageModel.findBetweenUsers(userId1, userId2, page, limit);
    return messages.map(message => ({
      ...message,
      timestamp: formatDate(message.timestamp)
    }));
  }

  static async markMessageAsRead(messageId) {
    return await MessageModel.markAsRead(messageId);
  }
}

module.exports = MessageService;
