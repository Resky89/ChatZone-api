const Joi = require('joi');

const communityAnnouncementSchema = Joi.object({
  community_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
  content: Joi.string().required()
});

module.exports = {
  communityAnnouncementSchema
}; 
