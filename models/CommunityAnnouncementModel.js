const pool = require('../config/db');

const CommunityAnnouncementModel = {
  async create(data) {
    const sql = 'INSERT INTO community_announcements (community_id, user_id, content) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [data.community_id, data.user_id, data.content]);
    return result.insertId;
  },

  async findAll() {
    const sql = `
      SELECT 
        a.announcement_id,
        a.content,
        a.timestamp,
        c.community_id,
        c.community_name,
        c.community_description,
        c.community_image_url,
        u.username,
        u.profile_picture
      FROM 
        community_announcements a
        INNER JOIN communities c ON a.community_id = c.community_id
        INNER JOIN users u ON a.user_id = u.user_id
      ORDER BY 
        a.timestamp DESC`;
    
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        a.announcement_id,
        a.content,
        a.timestamp,
        c.community_id,
        c.community_name,
        c.community_description,
        c.community_image_url,
        u.username,
        u.profile_picture
      FROM 
        community_announcements a
        INNER JOIN communities c ON a.community_id = c.community_id
        INNER JOIN users u ON a.user_id = u.user_id
      WHERE 
        a.announcement_id = ?`;
    
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  },

  async update(id, data) {
    const sql = 'UPDATE community_announcements SET community_id = ?, user_id = ?, content = ? WHERE announcement_id = ?';
    await pool.execute(sql, [data.community_id, data.user_id, data.content, id]);
  },

  async delete(id) {
    const sql = 'DELETE FROM community_announcements WHERE announcement_id = ?';
    await pool.execute(sql, [id]);
  }
};

module.exports = CommunityAnnouncementModel; 
