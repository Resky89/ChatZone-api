const pool = require('../config/db');

class CallModel {
  static async create(callData) {
    const { caller_id, receiver_id, call_type, call_duration, call_status } = callData;
    const [result] = await pool.query(
      'INSERT INTO calls (caller_id, receiver_id, call_type, call_duration, call_status) VALUES (?, ?, ?, ?, ?)',
      [caller_id, receiver_id, call_type, call_duration, call_status]
    );
    return result.insertId;
  }

  static async findCallLogsByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT 
          c.call_id AS "Call ID",
          "Outgoing" AS "Call Direction",
          receiver.username AS "Contact Name",
          receiver.profile_picture AS "Profile Picture",
          c.call_type AS "Call Type",
          c.call_duration AS "Duration (seconds)",
          c.call_status AS "Call Status",
          DATE_FORMAT(c.timestamp, '%Y-%m-%d %H:%i:%s') AS "Call Timestamp"
       FROM 
          calls c
       JOIN 
          users AS receiver ON c.receiver_id = receiver.user_id
       WHERE 
          c.caller_id = ?
       UNION ALL
       SELECT 
          c.call_id AS "Call ID",
          "Incoming" AS "Call Direction",
          caller.username AS "Contact Name",
          caller.profile_picture AS "Profile Picture",
          c.call_type AS "Call Type",
          c.call_duration AS "Duration (seconds)",
          c.call_status AS "Call Status",
          DATE_FORMAT(c.timestamp, '%Y-%m-%d %H:%i:%s') AS "Call Timestamp"
       FROM 
          calls c
       JOIN 
          users AS caller ON c.caller_id = caller.user_id
       WHERE 
          c.receiver_id = ?
       ORDER BY 
          "Call Timestamp" DESC`,
      [userId, userId]
    );
    return rows;
  }

  static async update(callId, callData) {
    const { call_type, call_duration, call_status } = callData;
    const [result] = await pool.query(
      'UPDATE calls SET call_type = ?, call_duration = ?, call_status = ? WHERE call_id = ?',
      [call_type, call_duration, call_status, callId]
    );
    return result.affectedRows > 0;
  }

  static async delete(callId) {
    const [result] = await pool.query('DELETE FROM calls WHERE call_id = ?', [callId]);
    return result.affectedRows > 0;
  }
  
}

module.exports = CallModel;
