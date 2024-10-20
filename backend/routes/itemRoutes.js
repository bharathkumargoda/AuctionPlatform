const express = require('express');
const { placeBid } = require('../controllers/itemController');

const router = express.Router();

router.post('/bid', placeBid);

module.exports = router;
