const pool = require('../config/db');

const CommunityMemberModel = {
  async create(data) {
    const sql = 'INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [data.community_id, data.user_id, data.role]);
    return result.insertId;
  },

  async findById(id) {
    const sql = 'SELECT * FROM community_members WHERE community_member_id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  },

  async update(id, data) {
    const sql = 'UPDATE community_members SET role = ? WHERE community_member_id = ?';
    await pool.execute(sql, [data.role, id]);
  },

  async delete(id) {
    const sql = 'DELETE FROM community_members WHERE community_member_id = ?';
    await pool.execute(sql, [id]);
  },

  async findByCommunityId(communityId) {
    const sql = `
      SELECT 
        Community_Members.community_member_id,
        Community_Members.community_id,
        Community_Members.user_id,
        Community_Members.role,
        Community_Members.joined_at,
        Users.phone_number,
        Users.username,
        Users.profile_picture
      FROM 
        Community_Members
      JOIN 
        Users ON Community_Members.user_id = Users.user_id
      WHERE 
        Community_Members.community_id = ?
    `;
    const [rows] = await pool.execute(sql, [communityId]);
    return rows;
  }
};

module.exports = CommunityMemberModel; 
