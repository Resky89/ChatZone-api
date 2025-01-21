const express = require('express');
const CommunityMemberController = require('../controllers/CommunityMemberController');

const router = express.Router();

router.post('/community-members', CommunityMemberController.create);
router.get('/community-members/:id', CommunityMemberController.getById);
router.put('/community-members/:id', CommunityMemberController.update);
router.delete('/community-members/:id', CommunityMemberController.delete);
router.get('/community-members/community/:communityId', CommunityMemberController.getByCommunityId);

module.exports = router; 
