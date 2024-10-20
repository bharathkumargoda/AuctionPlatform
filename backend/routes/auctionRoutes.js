const express = require('express');
const { getTodaysAuctions, createAuction, getAuctionDetails } = require('../controllers/auctionController');

const router = express.Router();

router.get('/today', getTodaysAuctions);
router.get('/:id', getAuctionDetails);
router.post('/addItems', createAuction);

module.exports = router;
