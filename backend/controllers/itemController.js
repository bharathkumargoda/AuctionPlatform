const Item = require('../models/item');
const { redisClient } = require('../db/redis');

// Place a bid on an item
const placeBid = async (req, res) => {
    const { itemId, userId, bidAmount } = req.body;

    // Check if the item exists
    const item = await Item.findById(itemId);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    // Ensure bid follows the minimum increment rule
    if (bidAmount < item.currentPrice + item.auction.minimumBidIncrement) {
        return res.status(400).json({ error: 'Bid must be higher than the current price by the minimum increment.' });
    }

    // Update current price and bids
    item.bids.push({ userId, amount: bidAmount });
    item.currentPrice = bidAmount;
    await item.save();

    // Update Redis cache if applicable
    await redisClient.set(`item:${itemId}`, JSON.stringify(item), { EX: 300 }); // Cache for 5 minutes

    res.json(item);
};

module.exports = { placeBid };
