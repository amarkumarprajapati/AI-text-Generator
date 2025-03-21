const express = require('express');
const router = express.Router();
const { trainNetwork, predict } = require('../controller/networkController');

router.post('/train', trainNetwork);
router.post('/predict', predict);

module.exports = router;