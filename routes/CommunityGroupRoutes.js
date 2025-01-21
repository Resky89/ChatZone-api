const express = require('express');
const CommunityGroupController = require('../controllers/CommunityGroupController');

const router = express.Router();

router.post('/community-groups', CommunityGroupController.create);
router.get('/community-groups/:id', CommunityGroupController.getById);
router.put('/community-groups/:id', CommunityGroupController.update);
router.delete('/community-groups/:id', CommunityGroupController.delete);
router.get('/community-groups/community/:communityId', CommunityGroupController.getByCommunityId);

module.exports = router; 
