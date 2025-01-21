const pool = require('../config/db');

const CommunityGroupModel = {
  async create(data) {
    const sql = 'INSERT INTO community_groups (community_id, group_id) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [data.community_id, data.group_id]);
    return result.insertId;
  },

  async findById(id) {
    const sql = 'SELECT * FROM community_groups WHERE community_group_id = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
  },

  async update(id, data) {
    const sql = 'UPDATE community_groups SET community_id = ?, group_id = ? WHERE community_group_id = ?';
    await pool.execute(sql, [data.community_id, data.group_id, id]);
  },

  async delete(id) {
    const sql = 'DELETE FROM community_groups WHERE community_group_id = ?';
    await pool.execute(sql, [id]);
  },

  async findByCommunityId(communityId) {
    const sql = `
      SELECT 
        cg.community_group_id,
        cg.created_at as group_joined_at,
        g.group_id,
        g.group_name,
        g.group_image_url,
        g.created_by as group_created_by,
        g.created_at as group_created_at
      FROM 
        community_groups cg
        INNER JOIN \`groups\` g ON cg.group_id = g.group_id
      WHERE 
        cg.community_id = ?
      ORDER BY 
        cg.created_at DESC`;
    
    const [rows] = await pool.execute(sql, [communityId]);
    return rows;
  }
};

module.exports = CommunityGroupModel; 
   