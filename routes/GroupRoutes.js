const express = require('express');
const GroupController = require('../controllers/GroupController');

const router = express.Router();

// Remove multer from routes as it's now handled in controller
router.post('/groups', GroupController.create);
router.get('/groups', GroupController.getAll);
router.get('/groups/:id', GroupController.getById);
router.put('/groups/:id', GroupController.update);
router.delete('/groups/:id', GroupController.delete);

module.exports = router;
