const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();

// Definisikan routes
router.post('/user', UserController.createUser);
router.get('/user', UserController.getAllUsers);
router.get('/user/:userId', UserController.getUserById);
router.put('/user/:userId', UserController.updateUserInfo);
router.patch('/user/:userId/status', UserController.updateOnlineStatus);
router.get('/user/phone/:phoneNumber', UserController.getUserByPhoneNumber);
router.delete('/user/:userId', UserController.deleteUser);

module.exports = router;
