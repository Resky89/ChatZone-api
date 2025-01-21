const pool = require('../config/db');

const GroupModel = {
  async create(group) {
    const [result] = await pool.query(
      'INSERT INTO groups (group_name, group_image_url, created_by) VALUES (?, ?, ?)',
      [group.group_name, group.group_image_url, group.created_by]
    );
    return result.insertId;
  },

  async findById(groupId) {
    const [rows] = await pool.query('SELECT * FROM groups WHERE group_id = ?', [groupId]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query('SELECT * FROM groups');
    return rows;
  },

  async update(groupId, group) {
    await pool.query(
      'UPDATE groups SET group_name = ?, group_image_url = ?, created_by = ? WHERE group_id = ?',
      [group.group_name, group.group_image_url, group.created_by, groupId]
    );
  },

  async delete(groupId) {
    await pool.query('DELETE FROM groups WHERE group_id = ?', [groupId]);
  }
};

module.exports = GroupModel;
