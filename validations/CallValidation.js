const Joi = require('joi');

const createCallSchema = Joi.object({
  caller_id: Joi.number().integer().required(),
  receiver_id: Joi.number().integer().required(),
  call_type: Joi.string().valid('voice', 'video').required(),
  call_duration: Joi.number().integer().optional(),
  call_status: Joi.string().valid('missed', 'answered', 'declined').required(),
});

const updateCallSchema = Joi.object({
  call_type: Joi.string().valid('voice', 'video').optional(),
  call_duration: Joi.number().integer().optional(),
  call_status: Joi.string().valid('missed', 'answered', 'declined').optional(),
});

const validateCreateCall = (data) => createCallSchema.validate(data);
const validateUpdateCall = (data) => updateCallSchema.validate(data);

module.exports = {
  validateCreateCall,
  validateUpdateCall,
};
