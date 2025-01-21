const express = require('express');
const CallController = require('../controllers/CallController');

const router = express.Router();

router.post('/call', CallController.createCall);
router.put('/call/:callId', CallController.updateCall);
router.delete('/call/:callId', CallController.deleteCall);
router.get('/call/logs/:userId', CallController.getCallLogsByUserId);

module.exports = router;
