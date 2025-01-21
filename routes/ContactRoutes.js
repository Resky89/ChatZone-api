const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');

router.get(
  '/users/:userId/contacts',
  ContactController.getAllContacts
);

router.get(
  '/users/:userId/contacts/:contactId',
  ContactController.getContactById
);

router.post(
  '/users/:userId/contacts',
  ContactController.createContact
);

router.put(
  '/users/:userId/contacts/:contactId',
  ContactController.updateContact
);

router.delete(
  '/users/:userId/contacts/:contactId',
  ContactController.deleteContact
);

module.exports = router;
