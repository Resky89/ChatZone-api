const ContactModel = require('../models/ContactModel');
const { formatDate } = require('../helpers/data-formatter');
const { contactSchema, contactUpdateSchema } = require('../validations/ContactValidation');
const Joi = require('joi');

class ContactService {
  async getAllContacts(userId) {
    const { error } = Joi.number().integer().required().validate(userId);
    if (error) {
      throw new Error('Invalid user ID');
    }

    const contacts = await ContactModel.findAll(userId);
    return contacts.map(contact => ({
      ...contact,
      added_at: formatDate(contact.added_at)
    }));
  }

  async getContactById(contactId, userId) {
    const schema = Joi.object({
      contactId: Joi.number().integer().required(),
      userId: Joi.number().integer().required()
    });

    const { error } = schema.validate({ contactId, userId });
    if (error) {
      throw new Error('Invalid contact or user ID');
    }

    const contact = await ContactModel.findById(contactId, userId);
    if (!contact) return null;

    return {
      ...contact,
      added_at: formatDate(contact.added_at)
    };
  }

  async createContact(contactData) {
    const { error, value } = contactSchema.validate(contactData);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const contact = await ContactModel.create(value);
    return {
      ...contact,
      added_at: formatDate(contact.added_at)
    };
  }

  async updateContact(contactId, userId, contactData) {
    // Validate IDs
    const idSchema = Joi.object({
      contactId: Joi.number().integer().required(),
      userId: Joi.number().integer().required()
    });

    const idValidation = idSchema.validate({ contactId, userId });
    if (idValidation.error) {
      throw new Error('Invalid contact or user ID');
    }

    // Validate update data
    const { error, value } = contactUpdateSchema.validate(contactData);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const contact = await ContactModel.update(contactId, userId, value);
    return {
      ...contact,
      added_at: formatDate(contact.added_at)
    };
  }

  async deleteContact(contactId, userId) {
    const schema = Joi.object({
      contactId: Joi.number().integer().required(),
      userId: Joi.number().integer().required()
    });

    const { error } = schema.validate({ contactId, userId });
    if (error) {
      throw new Error('Invalid contact or user ID');
    }

    return await ContactModel.delete(contactId, userId);
  }
}

module.exports = new ContactService();
