const Joi = require('joi');
const { sendErrorResponse } = require('../helpers/data-formatter');

const createContactSchema = Joi.object({
  contact_user_id: Joi.number().integer().required().messages({
    'number.base': 'Contact user ID must be an integer'
  }),
  nickname: Joi.string().trim().max(255).allow('').optional()
});

const updateContactSchema = Joi.object({
  nickname: Joi.string().trim().max(255).allow('').optional(),
  blocked: Joi.boolean().optional()
});

exports.validateCreateContact = (req, res, next) => {
  const { error } = createContactSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};

exports.validateUpdateContact = (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};

exports.validateUserId = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required().messages({
      'number.base': 'User ID must be an integer'
    })
  });

  const { error } = schema.validate({ userId: req.params.userId }, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};

exports.validateContactId = (req, res, next) => {
  const schema = Joi.object({
    contactId: Joi.number().integer().required().messages({
      'number.base': 'Contact ID must be an integer'
    })
  });

  const { error } = schema.validate({ contactId: req.params.contactId }, { abortEarly: false });
  if (error) {
    return sendErrorResponse(res, 'Validation error', 400, error.details);
  }
  next();
};
