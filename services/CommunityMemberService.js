const CommunityMemberModel = require('../models/CommunityMemberModel');
const { communityMemberSchema, communityMemberUpdateSchema } = require('../validations/CommunityMemberValidation');
const { formatDate } = require('../helpers/data-formatter');

const CommunityMemberService = {
  async create(data) {
    const { error } = communityMemberSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    const id = await CommunityMemberModel.create(data);
    return await CommunityMemberModel.findById(id);
  },

  async getById(id) {
    const member = await CommunityMemberModel.findById(id);
    if (member) {
      member.joined_at = formatDate(member.joined_at);
    }
    return member;
  },

  async update(id, data) {
    const { error } = communityMemberUpdateSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    
    const existingMember = await CommunityMemberModel.findById(id);
    if (!existingMember) throw new Error('Member not found');
    
    await CommunityMemberModel.update(id, data);
    return await CommunityMemberModel.findById(id);
  },

  async delete(id) {
    await CommunityMemberModel.delete(id);
  },

  async getByCommunityId(communityId) {
    const members = await CommunityMemberModel.findByCommunityId(communityId);
    return members.map(member => ({
      ...member,
      joined_at: formatDate(member.joined_at)
    }));
  }
};

module.exports = CommunityMemberService; 
