const pool = require('../config/db');

class MessageModel {
  static async create(messageData) {
    const { 
      sender_id, 
      receiver_id, 
      message_content = '', 
      message_type, 
      media_url = null, 
      status = 'sent', 
      reply_to = null 
    } = messageData;

    try {
      await pool.query('START TRANSACTION');

      // Insert the message
      const [messageResult] = await pool.query(
        'INSERT INTO messages (sender_id, receiver_id, message_content, message_type, media_url, status, reply_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [sender_id, receiver_id, message_content, message_type, media_url, status, reply_to]
      );
      const messageId = messageResult.insertId;

      // Check if chat exists
      const [existingChat] = await pool.query(
        'SELECT chat_id, user1_id, user2_id FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
        [sender_id, receiver_id, receiver_id, sender_id]
      );

      if (existingChat.length > 0) {
        // Update existing chat
        await pool.query(
          `UPDATE chats 
           SET last_message_id = ?, 
               last_message_time = CURRENT_TIMESTAMP,
               unread_count_user1 = CASE 
                 WHEN user1_id = ? THEN unread_count_user1 + 1
                 ELSE unread_count_user1
               END,
               unread_count_user2 = CASE 
                 WHEN user2_id = ? THEN unread_count_user2 + 1
                 ELSE unread_count_user2
               END
           WHERE chat_id = ?`,
          [messageId, receiver_id, receiver_id, existingChat[0].chat_id]
        );
      } else {
        // Create new chat
        const isUser1 = sender_id < receiver_id;
        await pool.query(
          `INSERT INTO chats 
           (user1_id, user2_id, last_message_id, last_message_time, unread_count_user1, unread_count_user2) 
           VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)`,
          [
            isUser1 ? sender_id : receiver_id,
            isUser1 ? receiver_id : sender_id,
            messageId,
            isUser1 ? 0 : 1,  // unread_count_user1: increment if receiver is user1
            isUser1 ? 1 : 0   // unread_count_user2: increment if receiver is user2
          ]
        );
      }

      await pool.query('COMMIT');
      return messageId;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('MessageModel create error:', error);
      throw error;
    }
  }

  static async findById(messageId) {
    const [rows] = await pool.query('SELECT * FROM messages WHERE message_id = ?', [messageId]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        receiver.username as receiver_name,
        receiver.profile_picture as receiver_profile_picture,
        receiver.online_status as receiver_online_status,
        reply.message_content as replied_message
      FROM 
        messages m
      LEFT JOIN 
        users sender ON m.sender_id = sender.user_id
      LEFT JOIN 
        users receiver ON m.receiver_id = receiver.user_id
      LEFT JOIN 
        messages reply ON m.reply_to = reply.message_id
      WHERE 
        m.sender_id = ? OR m.receiver_id = ?
      ORDER BY 
        m.timestamp DESC
    `, [userId, userId]);
    return rows;
  }

  static async findBetweenUsers(userId1, userId2) {
    const [rows] = await pool.query(`
      SELECT 
        m.*,
        sender.username as sender_name,
        sender.profile_picture as sender_profile_picture,
        sender.online_status as sender_online_status,
        receiver.username as receiver_name,
        receiver.profile_picture as receiver_profile_picture,
        receiver.online_status as receiver_online_status,
        reply.message_content as replied_message
      FROM 
        messages m
      LEFT JOIN 
        users sender ON m.sender_id = sender.user_id
      LEFT JOIN 
        users receiver ON m.receiver_id = receiver.user_id
      LEFT JOIN 
        messages reply ON m.reply_to = reply.message_id
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?) 
        OR 
        (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY 
        m.timestamp DESC
    `, [userId1, userId2, userId2, userId1]);
    return rows;
  }

  static async update(messageId, messageData) {
    const [result] = await pool.query(
      'UPDATE messages SET message_content = ?, message_type = ?, media_url = ?, status = ?, reply_to = ? WHERE message_id = ?',
      [messageData.message_content, messageData.message_type, messageData.media_url, messageData.status, messageData.reply_to, messageId]
    );
    return result.affectedRows > 0;
  }

  static async delete(messageId) {
    const [result] = await pool.query('DELETE FROM messages WHERE message_id = ?', [messageId]);
    return result.affectedRows > 0;
  }

  static async markAsRead(messageId) {
    const [result] = await pool.query(
      'UPDATE messages SET status = "read" WHERE message_id = ?',
      [messageId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = MessageModel;
