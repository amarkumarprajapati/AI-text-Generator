const express = require('express');
const router = express.Router();
const { processText } = require('../controller/networkController');

router.post('/process', processText);

module.exports = router;