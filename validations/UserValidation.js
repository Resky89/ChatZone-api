const Joi = require('joi');
const { sendErrorResponse } = require('../helpers/responseHelper'); // Correct import

const userSchema = Joi.object({
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format (e.g., +1234567890)'
    }),
  username: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Username must be between 1 and 255 characters',
      'string.max': 'Username must be between 1 and 255 characters'
    }),
  info: Joi.string()
    .trim()
    .max(255)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Info must not exceed 255 characters'
    }),
  online_status: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required()
    .messages({
      'number.min': 'Online status must be 0 or 1',
      'number.max': 'Online status must be 0 or 1'
    })
});

const updateUserInfoSchema = Joi.object({
  phone_number: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format (e.g., +1234567890)'
    }),
  username: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'Username must be between 1 and 255 characters',
      'string.max': 'Username must be between 1 and 255 characters'
    }),
  info: Joi.string()
    .trim()
    .max(255)
    .allow('')
    .required()
    .messages({
      'string.max': 'Info must not exceed 255 characters'
    })
});

const updateOnlineStatusSchema = Joi.object({
  online_status: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required()
    .messages({
      'number.min': 'Online status must be 0 or 1',
      'number.max': 'Online status must be 0 or 1'
    })
});

exports.validateCreateUser = (req, res) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: false,
      message: 'Validation error',
      errors: error.details
    });
  }
  return true; // Indicate validation success
};

exports.validateUpdateUserInfo = (req, res) => {
  const { error } = updateUserInfoSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  return true; // Indicate validation success
};

exports.validateUpdateOnlineStatus = (req, res) => {
  const { error } = updateOnlineStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  return true; // Indicate validation success
};

exports.validateProfilePicture = (req, res, next) => {
  if (!req.file) return next();

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return sendErrorResponse(res, 'Invalid file type. Only JPEG, PNG, and GIF are allowed.', 400);
  }
  next();
};
