const pool = require('../config/db');

class ContactModel {
  async findAll(userId) {
    const [rows] = await pool.query(
      `SELECT 
        c.contact_id,
        c.user_id,
        c.contact_user_id,
        c.nickname,
        c.blocked,
        c.added_at,
        u.phone_number,
        u.profile_picture,
        u.info,
        u.online_status
      FROM contacts c
      JOIN users u ON c.contact_user_id = u.user_id
      WHERE c.user_id = ?
      ORDER BY c.added_at DESC`,
      [userId]
    );
    return rows;
  }

  async findById(contactId, userId) {
    const [rows] = await pool.query(
      `SELECT 
        c.contact_id,
        c.user_id,
        c.contact_user_id,
        c.nickname,
        c.blocked,
        c.added_at,
        u.phone_number,
        u.profile_picture,
        u.info,
        u.online_status
      FROM contacts c
      JOIN users u ON c.contact_user_id = u.user_id
      WHERE c.contact_id = ? AND c.user_id = ?`,
      [contactId, userId]
    );
    return rows[0];
  }

  async create(contactData) {
    const { user_id, contact_user_id, nickname } = contactData;
    
    // Check if contact already exists
    const [existing] = await pool.query(
      'SELECT contact_id FROM contacts WHERE user_id = ? AND contact_user_id = ?',
      [user_id, contact_user_id]
    );

    if (existing.length > 0) {
      throw new Error('Contact already exists');
    }

    const [result] = await pool.query(
      'INSERT INTO contacts (user_id, contact_user_id, nickname, blocked, added_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP)',
      [user_id, contact_user_id, nickname]
    );

    // Return the newly created contact with user info
    const [newContact] = await pool.query(
      `SELECT 
        c.contact_id,
        c.user_id,
        c.contact_user_id,
        c.nickname,
        c.blocked,
        c.added_at,
        u.username,
        u.phone_number,
        u.profile_picture,
        u.info,
        u.online_status
      FROM contacts c
      JOIN users u ON c.contact_user_id = u.user_id
      WHERE c.contact_id = ?`,
      [result.insertId]
    );

    return newContact[0];
  }

  async update(contactId, userId, contactData) {
    const { nickname, blocked } = contactData;
    
    const [result] = await pool.query(
      'UPDATE contacts SET nickname = ?, blocked = ? WHERE contact_id = ? AND user_id = ?',
      [nickname, blocked, contactId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Contact not found');
    }

    // Return updated contact with user info
    const [updatedContact] = await pool.query(
      `SELECT 
        c.contact_id,
        c.user_id,
        c.contact_user_id,
        c.nickname,
        c.blocked,
        c.added_at,
        u.phone_number,
        u.profile_picture,
        u.info,
        u.online_status
      FROM contacts c
      JOIN users u ON c.contact_user_id = u.user_id
      WHERE c.contact_id = ? AND c.user_id = ?`,
      [contactId, userId]
    );

    return updatedContact[0];
  }

  async delete(contactId, userId) {
    const [result] = await pool.query(
      'DELETE FROM contacts WHERE contact_id = ? AND user_id = ?', 
      [contactId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Contact not found');
    }

    return true;
  }
}

module.exports = new ContactModel();
