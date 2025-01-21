const Joi = require('joi');

const groupSchema = Joi.object({
  group_name: Joi.string().max(255).required(),
  group_image_url: Joi.string().allow(null, ''),  // Removed .uri() validation
  created_by: Joi.number().integer().required()
});

module.exports = {
  groupSchema
};
