const Joi = require('joi');

const messageSchema = Joi.object({
  sender_id: Joi.number().integer().required(),
  receiver_id: Joi.number().integer().required(),
  message_content: Joi.string().allow(null, ''),
  message_type: Joi.string().valid('text', 'image', 'video', 'audio', 'file').required(),
  media_url: Joi.string().allow(null, ''),
  status: Joi.string().valid('sent', 'delivered', 'read').default('sent'),
  reply_to: Joi.number().integer().allow(null)
});

module.exports = {
  validateMessage: (data) => messageSchema.validate(data)
};
