const express = require('express');
const CommunityController = require('../controllers/CommunityController');

const router = express.Router();

router.post('/communities', CommunityController.create);
router.get('/communities', CommunityController.getAll);
router.get('/communities/:id', CommunityController.getById);
router.put('/communities/:id', CommunityController.update);
router.delete('/communities/:id', CommunityController.delete);

router.get('/communities/user/:userId', CommunityController.getUserCommunities);

module.exports = router;
