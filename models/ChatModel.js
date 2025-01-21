const pool = require('../config/db');

class ChatModel {
  static async create(chatData) {
    const { user1_id, user2_id, last_message_id, last_message_time } = chatData;
    const [result] = await pool.query(
      'INSERT INTO chats (user1_id, user2_id, last_message_id, last_message_time, unread count_user2) VALUES (?, ?, ?, ?,1)',
      [user1_id, user2_id, last_message_id, last_message_time]
    );
    return result.insertId;
  }

  static async getChatById(chatId) {
    const [rows] = await pool.query(
      `SELECT 
        c.chat_id,
        c.user1_id,
        c.user2_id,
        u1.username AS user1_name,
        u2.username AS user2_name,
        c.last_message_id,
        m.message_content AS last_message_content,
        m.timestamp AS last_message_time,
        c.unread_count_user1,
        c.unread_count_user2,
        c.is_archived_user1,
        c.is_archived_user2
      FROM 
        chats c
      LEFT JOIN 
        users u1 ON c.user1_id = u1.user_id
      LEFT JOIN 
        users u2 ON c.user2_id = u2.user_id
      LEFT JOIN 
        messages m ON c.last_message_id = m.message_id
      WHERE 
        c.chat_id = ?
      ORDER BY 
        c.last_message_time DESC`,
      [chatId]
    );
    return rows[0];
  }

  static async getChatsByUserId(userId) {
    const [rows] = await pool.query(
    `SELECT 
        c.chat_id,
        c.user1_id,
        COALESCE(ct1.nickname, u1.username) AS user1_name,
        u1.profile_picture AS user1_profile_picture,
        u1.online_status AS user1_online_status,
        c.unread_count_user1,
        c.user2_id,
        COALESCE(ct2.nickname, u2.username) AS user2_name,
        u2.profile_picture AS user2_profile_picture,
        u2.online_status AS user2_online_status,
        m.message_content AS last_message_content,
        m.timestamp AS last_message_time,
        m.sender_id AS last_message_sender_id,
        m.receiver_id AS last_message_receiver_id,
        m.status AS last_message_status,
        c.unread_count_user2
    FROM 
        chats AS c
    JOIN 
        users AS u1 ON c.user1_id = u1.user_id
    JOIN 
        users AS u2 ON c.user2_id = u2.user_id
    LEFT JOIN 
        contacts AS ct1 ON (ct1.user_id = c.user2_id AND ct1.contact_user_id = c.user1_id)
    LEFT JOIN 
        contacts AS ct2 ON (ct2.user_id = c.user1_id AND ct2.contact_user_id = c.user2_id)
    LEFT JOIN 
        messages AS m ON c.last_message_id = m.message_id
    WHERE 
        c.user1_id = ? OR c.user2_id = ?
    ORDER BY 
        m.timestamp DESC`,
      [userId, userId]
    );
    return rows;
  }

  static async getChatsBetweenUsers(userId1, userId2) {
    const [rows] = await pool.query(
      `SELECT 
        c.chat_id,
        c.user1_id,
        c.user2_id,
        u1.username AS user1_name,
        u2.username AS user2_name,
        c.last_message_id,
        m.message_content AS last_message_content,
        m.timestamp AS last_message_time,
        c.unread_count_user1,
        c.unread_count_user2,
        c.is_archived_user1,
        c.is_archived_user2
      FROM 
        chats c
      LEFT JOIN 
        users u1 ON c.user1_id = u1.user_id
      LEFT JOIN 
        users u2 ON c.user2_id = u2.user_id
      LEFT JOIN 
        messages m ON c.last_message_id = m.message_id
      WHERE 
        (c.user1_id = ? AND c.user2_id = ?) OR (c.user1_id = ? AND c.user2_id = ?)
      ORDER BY 
        c.last_message_time DESC`,
      [userId1, userId2, userId2, userId1]
    );
    return rows;
  }

  static async updateChat(chatId, chatData) {
    // Build dynamic query based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (chatData.last_message_id !== undefined) {
      updateFields.push('last_message_id = ?');
      queryParams.push(chatData.last_message_id);
    }
    
    if (chatData.last_message_time !== undefined) {
      updateFields.push('last_message_time = ?');
      queryParams.push(chatData.last_message_time);
    }
    
    if (chatData.unread_count_user1 !== undefined) {
      updateFields.push('unread_count_user1 = ?');
      queryParams.push(chatData.unread_count_user1);
    }
    
    if (chatData.unread_count_user2 !== undefined) {
      updateFields.push('unread_count_user2 = ?');
      queryParams.push(chatData.unread_count_user2);
    }

    // Add chatId to params array
    queryParams.push(chatId);

    const query = `UPDATE chats SET ${updateFields.join(', ')} WHERE chat_id = ?`;
    
    const [result] = await pool.query(query, queryParams);
    return result.affectedRows > 0;
  }

  static async deleteChat(chatId) {
    const [result] = await pool.query('DELETE FROM chats WHERE chat_id = ?', [chatId]);
    return result.affectedRows > 0;
  }
}

module.exports = ChatModel;
