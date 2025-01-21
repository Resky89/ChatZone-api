const Joi = require('joi');
const { sendErrorResponse } = require('../helpers/responseHelper');

// Export the schema so it can be used in the service
exports.chatSchema = Joi.object({
  chat_id: Joi.number().integer(),
  user1_id: Joi.number().integer().required(),
  user1_name: Joi.string(),
  user1_profile_picture: Joi.string().allow(null),
  user1_online_status: Joi.string(),
  user2_id: Joi.number().integer().required(),
  user2_name: Joi.string(),
  user2_profile_picture: Joi.string().allow(null),
  user2_online_status: Joi.string(),
  last_message_content: Joi.string().allow(null),
  last_message_time: Joi.date().allow(null),
  last_message_sender_id: Joi.number().integer().allow(null),
  last_message_receiver_id: Joi.number().integer().allow(null),
  last_message_status: Joi.string().valid('sent', 'delivered', 'read').allow(null),
  unread_count: Joi.number().integer().default(0)
});

exports.validateCreateChat = (req, res, next) => {
  const { error } = exports.chatSchema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};

exports.validateUpdateChat = (req, res, next) => {
  const updateSchema = exports.chatSchema.fork(['user1_id', 'user2_id'], (schema) => schema.optional());
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};

exports.validateChatId = (req, res, next) => {
  const schema = Joi.object({
    chatId: Joi.number().integer().required()
  });
  const { error } = schema.validate({ chatId: req.params.chatId });
  if (error) {
    return sendErrorResponse(res, 'Invalid chat ID', 400);
  }
  next();
};

exports.validateUserId = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required()
  });
  const { error } = schema.validate({ userId: req.params.userId });
  if (error) {
    return sendErrorResponse(res, 'Invalid user ID', 400);
  }
  next();
};

exports.chatUpdateSchema = Joi.object({
  last_message_id: Joi.number().integer().allow(null),
  last_message_time: Joi.date().allow(null),
  last_message_status: Joi.string().valid('sent', 'delivered', 'read').allow(null),
  unread_count_user1: Joi.number().integer().min(0),
  unread_count_user2: Joi.number().integer().min(0)
}).min(1); // Require at least one field to be present

exports.validateChatUpdate = (req, res, next) => {
  const { error } = exports.chatUpdateSchema.validate(req.body);
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};
