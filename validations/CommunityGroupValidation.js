const Joi = require('joi');

const communityGroupSchema = Joi.object({
  community_id: Joi.number().integer().required(),
  group_id: Joi.number().integer().required()
});

module.exports = {
  communityGroupSchema
}; 
