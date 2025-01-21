const pool = require('../config/db');

class UserModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { phone_number, username, profile_picture_path, info, online_status } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (phone_number, username, profile_picture, info, online_status) VALUES (?, ?, ?, ?, ?)',
      [phone_number, username, profile_picture_path, info, online_status]
    );
    return result.insertId;
  }

  static async updateInfo(id, userData) {
    try {
      const { phone_number, username, info, profile_picture_path } = userData;
      const [result] = await pool.query(
        'UPDATE users SET phone_number = ?, username = ?, info = ?, profile_picture = ? WHERE user_id = ?',
        [phone_number, username, info, profile_picture_path, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('No user found with the given ID');
      }
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in UserModel.updateInfo:', error);
      throw error;
    }
  }

  static async updateOnlineStatus(id, onlineStatus) {
    const [result] = await pool.query(
      'UPDATE users SET online_status = ? WHERE user_id = ?',
      [onlineStatus, id]
    );
    return result.affectedRows > 0;
  }

  static async findByPhoneNumber(phoneNumber) {
    const [rows] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]);
    return rows[0];
  }

  static async delete(userId) {
    try {
      // Ambil data user untuk mendapatkan profile picture
      const [user] = await pool.query('SELECT profile_picture FROM users WHERE user_id = ?', [userId]);
      
      // Hapus user dari database
      const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
      
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      // Return profile picture path untuk dihapus
      return user[0]?.profile_picture;
    } catch (error) {
      console.error('Error in UserModel.delete:', error);
      throw error;
    }
  }
}

module.exports = UserModel;
