const CommunityGroupModel = require('../models/CommunityGroupModel');
const { communityGroupSchema } = require('../validations/CommunityGroupValidation');
const { formatDate } = require('../helpers/data-formatter');

const CommunityGroupService = {
  async create(data) {
    const { error } = communityGroupSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    const id = await CommunityGroupModel.create(data);
    return await CommunityGroupModel.findById(id);
  },

  async getById(id) {
    const group = await CommunityGroupModel.findById(id);
    if (group) {
      group.created_at = formatDate(group.created_at);
    }
    return group;
  },

  async update(id, data) {
    const { error } = communityGroupSchema.validate(data);
    if (error) throw new Error(error.details[0].message);
    await CommunityGroupModel.update(id, data);
    return await CommunityGroupModel.findById(id);
  },

  async delete(id) {
    await CommunityGroupModel.delete(id);
  }
};

module.exports = CommunityGroupService; 
