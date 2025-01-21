const express = require('express');
const CommunityAnnouncementController = require('../controllers/CommunityAnnouncementController');

const router = express.Router();

router.post('/community-announcements', CommunityAnnouncementController.create);
router.get('/community-announcements/:id', CommunityAnnouncementController.getById);
router.put('/community-announcements/:id', CommunityAnnouncementController.update);
router.delete('/community-announcements/:id', CommunityAnnouncementController.delete);
router.get('/community-announcements', CommunityAnnouncementController.getAll);

module.exports = router; 
