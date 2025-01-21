const GroupMemberModel = require('../models/GroupMemberModel');
const { groupMemberSchema, updateGroupMemberSchema } = require('../validations/GroupMemberValidation');
const { formatDate } = require('../helpers/data-formatter');

const GroupMemberService = {
  async createMember(data) {
    const { error } = groupMemberSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    const memberId = await GroupMemberModel.create(data);
    return this.getMemberById(memberId);
  },

  async getMemberById(memberId) {
    const member = await GroupMemberModel.findById(memberId);
    if (member) {
      member.joined_at = formatDate(member.joined_at);
    }
    return member;
  },

  async getAllMembers() {
    const members = await GroupMemberModel.findAll();
    return members.map(member => ({
      ...member,
      joined_at: formatDate(member.joined_at)
    }));
  },

  async getGroupMembers(groupId) {
    const members = await GroupMemberModel.findByGroupId(groupId);
    return members.map(member => ({
      ...member,
      joined_at: formatDate(member.joined_at)
    }));
  },

  async updateMember(memberId, data) {
    const { error } = updateGroupMemberSchema.validate(data);
    if (error) throw new Error(error.details[0].message);

    await GroupMemberModel.update(memberId, data);
    return this.getMemberById(memberId);
  },

  async deleteMember(memberId) {
    const member = await this.getMemberById(memberId);
    if (!member) throw new Error('Member not found');
    
    await GroupMemberModel.delete(memberId);
    return member;
  }
};

module.exports = GroupMemberService;
