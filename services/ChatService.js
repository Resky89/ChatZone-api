const ChatModel = require('../models/ChatModel');
const { formatDate } = require('../helpers/data-formatter');
const { chatSchema, chatUpdateSchema } = require('../validations/ChatValidation');
const Joi = require('joi');
const pool = require('../config/db');

class ChatService {
  static async createChat(chatData) {
    // Validate chat data
    const { error, value } = chatSchema.validate(chatData);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    value.last_message_time = formatDate(value.last_message_time);
    return await ChatModel.create(value);
  }

  static async getUserChats(userId) {
    // Validate userId
    const { error } = Joi.number().integer().required().validate(userId);
    if (error) {
      throw new Error('Invalid user ID');
    }

    const chats = await ChatModel.getChatsByUserId(userId);
    return chats.map(chat => {
      // Format the date only if it exists
      const formattedDate = chat.last_message_time ? formatDate(chat.last_message_time) : null;
      
      return {
        chat_id: chat.chat_id,
        user1_id: chat.user1_id,
        user1_name: chat.user1_name,
        user1_profile_picture: chat.user1_profile_picture,
        user1_online_status: chat.user1_online_status,
        unread_count_user1: chat.unread_count_user1,
        user2_id: chat.user2_id,
        user2_name: chat.user2_name,
        user2_profile_picture: chat.user2_profile_picture,
        user2_online_status: chat.user2_online_status,
        unread_count_user2: chat.unread_count_user2,
        last_message_content: chat.last_message_content,
        last_message_time: formattedDate, // Using the formatted date
        last_message_sender_id: chat.last_message_sender_id,
        last_message_receiver_id: chat.last_message_receiver_id,
        last_message_status: chat.last_message_status
        
      };
    });
  }

  static async getChatsBetweenUsers(userId1, userId2) {
    const schema = Joi.object({
      userId1: Joi.number().integer().required(),
      userId2: Joi.number().integer().required()
    });

    const { error } = schema.validate({ userId1, userId2 });
    if (error) {
      throw new Error('Invalid user IDs');
    }

    return await ChatModel.getChatsBetweenUsers(userId1, userId2);
  }

  static async updateChat(chatId, chatData) {
    // Validate chatId
    const chatIdValidation = Joi.number().integer().required().validate(chatId);
    if (chatIdValidation.error) {
      throw new Error('Invalid chat ID');
    }

    // Validate update data
    const { error, value } = chatUpdateSchema.validate(chatData);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    try {
      // Get current chat data
      const [currentChat] = await pool.query(
        'SELECT last_message_id, last_message_time, unread_count_user1, unread_count_user2 FROM chats WHERE chat_id = ?',
        [chatId]
      );

      if (!currentChat || currentChat.length === 0) {
        throw new Error('Chat not found');
      }

      // Merge current data with updates
      const updateData = {
        last_message_id: value.last_message_id ?? currentChat[0].last_message_id,
        last_message_time: value.last_message_time ? formatDate(value.last_message_time) : currentChat[0].last_message_time,
        unread_count_user1: value.unread_count_user1 ?? currentChat[0].unread_count_user1,
        unread_count_user2: value.unread_count_user2 ?? currentChat[0].unread_count_user2
      };

      return await ChatModel.updateChat(chatId, updateData);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async deleteChat(chatId) {
    // Validate chatId
    const { error } = Joi.number().integer().required().validate(chatId);
    if (error) {
      throw new Error('Invalid chat ID');
    }

    return await ChatModel.deleteChat(chatId);
  }
}

module.exports = ChatService;
