const ChatService = require('../services/ChatService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

class ChatController {
  static async createChat(req, res) {
    try {
      const chatId = await ChatService.createChat(req.body);
      sendSuccessResponse(res, { chatId }, 201);
    } catch (error) {
      sendErrorResponse(res, `Failed to create chat: ${error.message}`, 500);
    }
  }

  static async getUserChats(req, res) {
    try {
      const { userId } = req.params;
      const chats = await ChatService.getUserChats(userId);
      
      sendSuccessResponse(res, {
        status: 'success',
        data: chats.map(chat => ({
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
          last_message_time: chat.last_message_time,
          last_message_sender_id: chat.last_message_sender_id,
          last_message_receiver_id: chat.last_message_receiver_id,
          last_message_status: chat.last_message_status
        }))
      });
    } catch (error) {
      sendErrorResponse(res, `Failed to get user chats: ${error.message}`, 500);
    }
  }

  static async updateChat(req, res) {
    try {
      const { chatId } = req.params;
      const updateData = {};

      // Only include fields that are present in the request
      if (req.body.last_message_id !== undefined) {
        updateData.last_message_id = req.body.last_message_id;
      }
      if (req.body.last_message_time !== undefined) {
        updateData.last_message_time = req.body.last_message_time;
      }
      if (req.body.unread_count_user1 !== undefined) {
        updateData.unread_count_user1 = req.body.unread_count_user1;
      }
      if (req.body.unread_count_user2 !== undefined) {
        updateData.unread_count_user2 = req.body.unread_count_user2;
      }

      const updated = await ChatService.updateChat(chatId, updateData);
      
      if (updated) {
        sendSuccessResponse(res, { 
          status: 'success',
          message: 'Chat updated successfully'
        });
      } else {
        sendErrorResponse(res, 'Chat not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, `Failed to update chat: ${error.message}`, 500);
    }
  }

  static async deleteChat(req, res) {
    try {
      const deleted = await ChatService.deleteChat(req.params.chatId);
      if (deleted) {
        sendSuccessResponse(res, { message: 'Chat deleted successfully' });
      } else {
        sendErrorResponse(res, 'Chat not found', 404);
      }
    } catch (error) {
      sendErrorResponse(res, 'Failed to delete chat', 500);
    }
  }
}

module.exports = ChatController;
