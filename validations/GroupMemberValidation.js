const Joi = require('joi');

const groupMemberSchema = Joi.object({
  group_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
  role: Joi.string().valid('admin', 'member').required()
});

const updateGroupMemberSchema = Joi.object({
  role: Joi.string().valid('admin', 'member').required()
});

module.exports = {
  groupMemberSchema,
  updateGroupMemberSchema
};
