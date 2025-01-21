const Joi = require('joi');

const communitySchema = Joi.object({
  community_name: Joi.string().max(255).required(),
  community_description: Joi.string().allow(null, ''),
  community_image_url: Joi.string().allow(null, ''),
  created_by: Joi.number().integer().required()
});

const updateCommunitySchema = Joi.object({
  community_name: Joi.string().max(255).required(),
  community_description: Joi.string().allow(null, ''),
  community_image_url: Joi.string().allow(null, '')
});

module.exports = {
  communitySchema,
  updateCommunitySchema
};
