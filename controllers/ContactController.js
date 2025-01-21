const ContactService = require('../services/ContactService');
const { sendSuccessResponse, sendErrorResponse } = require('../helpers/responseHelper');

class ContactController {
  async getAllContacts(req, res) {
    try {
      const contacts = await ContactService.getAllContacts(req.params.userId);
      sendSuccessResponse(res, {
        status: 'success',
        data: contacts
      });
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async getContactById(req, res) {
    try {
      const contact = await ContactService.getContactById(
        req.params.contactId,
        req.params.userId
      );
      
      if (!contact) {
        return sendErrorResponse(res, 'Contact not found', 404);
      }

      sendSuccessResponse(res, {
        status: 'success',
        data: contact
      });
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async createContact(req, res) {
    try {
      const contactData = {
        user_id: parseInt(req.params.userId),
        contact_user_id: parseInt(req.body.contact_user_id),
        nickname: req.body.nickname
      };

      const newContact = await ContactService.createContact(contactData);
      sendSuccessResponse(res, {
        status: 'success',
        data: newContact
      }, 201);
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async updateContact(req, res) {
    try {
      const updatedContact = await ContactService.updateContact(
        parseInt(req.params.contactId),
        parseInt(req.params.userId),
        req.body
      );

      sendSuccessResponse(res, {
        status: 'success',
        data: updatedContact
      });
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }

  async deleteContact(req, res) {
    try {
      await ContactService.deleteContact(
        parseInt(req.params.contactId),
        parseInt(req.params.userId)
      );

      sendSuccessResponse(res, {
        status: 'success',
        message: 'Contact deleted successfully'
      });
    } catch (error) {
      sendErrorResponse(res, error.message, 500);
    }
  }
}

module.exports = new ContactController();
