const express = require('express');
const GroupMemberController = require('../controllers/GroupMemberController');

const router = express.Router();

router.post('/group-members', GroupMemberController.create);
router.get('/group-members', GroupMemberController.getAll);
router.get('/group-members/:id', GroupMemberController.getById);
router.get('/groups/:groupId/members', GroupMemberController.getGroupMembers);
router.put('/group-members/:id', GroupMemberController.update);
router.delete('/group-members/:id', GroupMemberController.delete);

module.exports = router;
