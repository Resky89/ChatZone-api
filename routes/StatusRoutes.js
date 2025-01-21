const express = require('express');
const StatusController = require('../controllers/StatusController');

const router = express.Router();

// Status creation and general operations
router.post('/statuses', StatusController.createStatus);
router.put('/statuses/:id', StatusController.updateStatus);
router.delete('/statuses/:id', StatusController.deleteStatus);

// Status retrieval routes
router.get('/statuses/:id', StatusController.getStatus);
router.get('/users/:userId/own-statuses', StatusController.getUserOwnStatuses);
router.get('/users/:userId/contact-statuses', StatusController.getUserContactStatuses);
router.get('/statuses/exclude/:userId', StatusController.getAllStatusesExceptUser);

module.exports = router;
