const pool = require('../config/db');

const GroupMemberModel = {
  async create(groupMember) {
    const [result] = await pool.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
      [groupMember.group_id, groupMember.user_id, groupMember.role]
    );
    return result.insertId;
  },

  async findById(groupMemberId) {
    const [rows] = await pool.query(
      'SELECT gm.*, u.username, u.profile_picture ' +
      'FROM group_members gm ' +
      'JOIN users u ON gm.user_id = u.user_id ' +
      'WHERE gm.group_member_id = ?', 
      [groupMemberId]
    );
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query(
      'SELECT gm.*, u.username, u.profile_picture ' +
      'FROM group_members gm ' +
      'JOIN users u ON gm.user_id = u.user_id'
    );
    return rows;
  },

  async findByGroupId(groupId) {
    const [rows] = await pool.query(
      'SELECT gm.group_member_id, gm.group_id, gm.user_id, ' +
      'u.username, u.profile_picture, gm.role, gm.joined_at ' +
      'FROM group_members gm ' +
      'JOIN users u ON gm.user_id = u.user_id ' +
      'WHERE gm.group_id = ? ' +
      'ORDER BY gm.joined_at DESC',
      [groupId]
    );
    return rows;
  },

  async update(groupMemberId, groupMember) {
    const [result] = await pool.query(
      'UPDATE group_members SET role = ? WHERE group_member_id = ?',
      [groupMember.role, groupMemberId]
    );
    return result.affectedRows > 0;
  },

  async delete(groupMemberId) {
    const [result] = await pool.query(
      'DELETE FROM group_members WHERE group_member_id = ?', 
      [groupMemberId]
    );
    return result.affectedRows > 0;
  },

  // Tambahan method untuk cek apakah user sudah menjadi anggota grup
  async findMembershipStatus(groupId, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );
    return rows[0];
  }
};

module.exports = GroupMemberModel;
