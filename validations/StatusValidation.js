const Joi = require('joi');

const statusSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  text_caption: Joi.string().max(255).allow(null, ''),
  expires_at: Joi.date().iso().allow(null),
  media_url: Joi.string().allow(null, ''),
  fileType: Joi.string().valid('image', 'video').allow(null)
}).unknown(true);

const statusIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const mediaSchema = Joi.object({
  mimetype: Joi.string().pattern(/^(image|video)\//).required(),
  size: Joi.number().positive().required(),
  filename: Joi.string().required()
});

// Export the validation functions
exports.validateStatusData = (data) => {
  return statusSchema.validate(data);
};

exports.validateStatusIdData = (data) => {
  return statusIdSchema.validate(data);
};

exports.validateMediaFile = (file) => {
  return mediaSchema.validate(file);
};
