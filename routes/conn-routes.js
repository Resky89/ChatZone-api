const express = require('express');
const router = express.Router();
const { checkConnection } = require('../controllers/conn-controller');

router.get('/check', checkConnection);

module.exports = router;
