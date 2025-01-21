const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Status {
  static async userExists(userId) {
    const [rows] = await db.execute('SELECT 1 FROM users WHERE user_id = ?', [userId]);
    return rows.length > 0;
  }

  static async create(status, file) {
    // Check if user exists
    const userExists = await this.userExists(status.user_id);
    if (!userExists) {
      throw new Error('User not found');
    }

    let mediaUrl = null;
    if (file) {
      mediaUrl = file.filename;
    }

    // Set expires_at to 24 hours from now if not provided
    if (!status.expires_at) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      status.expires_at = expiresAt;
    }

    const [result] = await db.execute(
      'INSERT INTO statuses (user_id, media_url, text_caption, expires_at) VALUES (?, ?, ?, ?)',
      [status.user_id, mediaUrl, status.text_caption, status.expires_at]
    );
    return result.insertId;
  }

  static async processAndSaveMedia(file) {
    if (!file) return null;

    const uploadDir = path.join(__dirname, '../media/statuses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    return file.filename;
  }

  static async getById(statusId) {
    const [rows] = await db.execute(`
      SELECT 
        Statuses.status_id AS "Status ID",
        Users.username AS "Username",
        Users.profile_picture AS "Profile Picture",
        Statuses.media_url AS "Media URL",
        Statuses.text_caption AS "Caption",
        Statuses.created_at AS "Created At",
        Statuses.expires_at AS "Expires At"
      FROM 
        Statuses
      JOIN 
        Users ON Statuses.user_id = Users.user_id
      WHERE 
        Statuses.status_id = ?
    `, [statusId]);
    return rows[0];
  }

  static async getUserOwnStatuses(userId) {
    const [rows] = await db.execute(`
      SELECT 
        Statuses.status_id AS "status_id",
        Statuses.user_id AS "user_id",
        Users.username AS "Username",
        Users.profile_picture AS "Profile Picture",
        Statuses.media_url AS "Media URL",
        Statuses.text_caption AS "Caption",
        Statuses.created_at AS "Created At",
        Statuses.expires_at AS "Expires At"
      FROM 
        Statuses
      JOIN 
        Users ON Statuses.user_id = Users.user_id
      WHERE 
        Statuses.user_id = ?
      ORDER BY 
        "Created At" DESC
    `, [userId]);
    return rows;
  }

  static async getUserContactStatuses(userId) {
    const [rows] = await db.execute(`
      SELECT 
        Statuses.status_id AS "status_id",
        Statuses.user_id AS "user_id",
        Users.username AS "Username",
        Users.profile_picture AS "Profile Picture",
        Statuses.media_url AS "Media URL",
        Statuses.text_caption AS "Caption",
        Statuses.created_at AS "Created At",
        Statuses.expires_at AS "Expires At"
      FROM 
        Statuses
      JOIN 
        Users ON Statuses.user_id = Users.user_id
      JOIN 
        Contacts ON Contacts.contact_user_id = Statuses.user_id
      WHERE 
        Contacts.user_id = ?
      ORDER BY 
        "Created At" DESC
    `, [userId]);
    return rows;
  }

  static async update(statusId, status, file) {
    let mediaUrl = status.media_url;
    if (file) {
      mediaUrl = await this.processAndSaveMedia(file);
      if (status.media_url) {
        await this.deleteOldMedia(status.media_url);
      }
    }

    const [result] = await db.execute(
      'UPDATE statuses SET media_url = ?, text_caption = ?, expires_at = ? WHERE status_id = ?',
      [mediaUrl, status.text_caption, status.expires_at, statusId]
    );
    return result.affectedRows;
  }

  static async delete(statusId) {
    const status = await this.getById(statusId);
    if (status && status.media_url) {
      await this.deleteOldMedia(status.media_url);
    }

    const [result] = await db.execute('DELETE FROM statuses WHERE status_id = ?', [statusId]);
    return result.affectedRows;
  }

  static async deleteOldMedia(mediaUrl) {
    if (!mediaUrl) return;
    
    const filePath = path.join(__dirname, '../media/statuses', mediaUrl);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`Successfully deleted media file: ${mediaUrl}`);
      }
    } catch (error) {
      console.error(`Error deleting media file ${mediaUrl}:`, error);
      // Tidak throw error agar proses penghapusan status tetap berjalan
    }
  }

  static async deleteExpiredStatuses() {
    try {
      // Ambil dulu status yang expired beserta media_url nya
      const [expiredStatuses] = await db.execute(`
        SELECT status_id, media_url 
        FROM Statuses 
        WHERE expires_at IS NOT NULL 
        AND expires_at < NOW()
      `);

      // Jika ada status yang expired
      if (expiredStatuses.length > 0) {
        // Hapus file media untuk setiap status yang expired
        for (const status of expiredStatuses) {
          if (status.media_url) {
            await this.deleteOldMedia(status.media_url);
          }
        }

        // Hapus status dari database
        const [result] = await db.execute(`
          DELETE FROM Statuses 
          WHERE expires_at IS NOT NULL 
          AND expires_at < NOW()
        `);
        
        return result.affectedRows;
      }
      
      return 0;
    } catch (error) {
      console.error('Error deleting expired statuses:', error);
      throw error;
    }
  }

  static async getAllExceptUser(userId) {
    const [rows] = await db.execute(`
      SELECT 
        Statuses.status_id AS "status_id",
        Statuses.user_id AS "user_id",
        Users.username AS "Username",
        Users.profile_picture AS "Profile Picture",
        Statuses.media_url AS "Media URL",
        Statuses.text_caption AS "Caption",
        Statuses.created_at AS "Created At",
        Statuses.expires_at AS "Expires At"
      FROM 
        Statuses
      JOIN 
        Users ON Statuses.user_id = Users.user_id
      WHERE 
        Statuses.user_id != ?
      ORDER BY 
        \`Created At\` DESC;
    `, [userId]);
    return rows;
  }

  static async isStatusExpired(statusId) {
    const [rows] = await db.execute(`
      SELECT 
        CASE 
          WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN 1
          ELSE 0
        END as is_expired
      FROM Statuses
      WHERE status_id = ?
    `, [statusId]);

    return rows[0]?.is_expired === 1;
  }
}

module.exports = Status;
