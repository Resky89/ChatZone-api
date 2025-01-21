const pool = require('../config/db');

const CommunityModel = {
  async create(community) {
    const [result] = await pool.query(
      'INSERT INTO communities (community_name, community_description, community_image_url, created_by) VALUES (?, ?, ?, ?)',
      [community.community_name, community.community_description, community.community_image_url, community.created_by]
    );
    return result.insertId;
  },

  async findById(communityId) {
    const [rows] = await pool.query(
      'SELECT c.*, u.username as creator_name FROM communities c ' +
      'LEFT JOIN users u ON c.created_by = u.user_id ' +
      'WHERE c.community_id = ?',
      [communityId]
    );
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT c.*, u.username as creator_name FROM communities c ' +
      'LEFT JOIN users u ON c.created_by = u.user_id ' +
      'ORDER BY c.created_at DESC'
    );
    return rows;
  },

  async update(communityId, community) {
    await pool.query(
      'UPDATE communities SET community_name = ?, community_description = ?, community_image_url = ? WHERE community_id = ?',
      [community.community_name, community.community_description, community.community_image_url, communityId]
    );
  },

  async delete(communityId) {
    await pool.query('DELETE FROM communities WHERE community_id = ?', [communityId]);
  },

  async getCommunityDetailsByUserId(userId) {
    const sql = `
      SELECT 
        c.community_id,
        c.community_name,
        c.community_description, 
        c.community_image_url,
        c.created_by,
        c.created_at,
        cm.user_id AS community_user_id,
        cm.role AS member_role,
        cm.joined_at AS member_joined_at,
        g.group_id,
        g.group_name,
        g.group_image_url,
        g.created_at as group_created_at,
        (
          SELECT COUNT(*) 
          FROM community_members cm2 
          WHERE cm2.community_id = c.community_id
        ) as total_members
      FROM 
        communities c
      INNER JOIN 
        community_members cm ON c.community_id = cm.community_id
      LEFT JOIN 
        community_groups cg ON c.community_id = cg.community_id
      LEFT JOIN 
        \`groups\` g ON cg.group_id = g.group_id
      WHERE 
        cm.user_id = ?
      ORDER BY 
        c.created_at DESC, g.created_at DESC
    `;

    const [rows] = await pool.query(sql, [userId]);
    
    // Format data to group the groups under each community
    const communities = {};
    
    rows.forEach(row => {
      if (!communities[row.community_id]) {
        communities[row.community_id] = {
          community_id: row.community_id,
          community_name: row.community_name,
          community_description: row.community_description,
          community_image_url: row.community_image_url,
          created_by: row.created_by,
          created_at: row.created_at,
          community_user_id: row.community_user_id,
          member_role: row.member_role,
          member_joined_at: row.member_joined_at,
          total_members: row.total_members,
          groups: []
        };
      }
      
      if (row.group_id) {
        communities[row.community_id].groups.push({
          group_id: row.group_id,
          group_name: row.group_name,
          group_image_url: row.group_image_url,
          created_at: row.group_created_at
        });
      }
    });

    return Object.values(communities);
  }
};

module.exports = CommunityModel;
