const Joi = require('joi');

const communityMemberSchema = Joi.object({
  community_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
  role: Joi.string().valid('admin', 'member').required()
});

const communityMemberUpdateSchema = Joi.object({
  role: Joi.string().valid('admin', 'member').required()
});

module.exports = {
  communityMemberSchema,
  communityMemberUpdateSchema
}; 
