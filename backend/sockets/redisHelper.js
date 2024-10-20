const redisClient = require('../db/redis');

// Write the new bid to Redis (add it to a list for bid history)
async function writeBidToRedis(itemId, bid) {
    const itemKey = `item:${itemId}:bids`;

    // Push the new bid to the Redis list (the list is the bid history for that item)
    await redisClient.lPush(itemKey, JSON.stringify(bid));

    // Optionally, set an expiration for the item (e.g., 1 day after auction ends)
    await redisClient.expire(itemKey, 86400); // 1 day expiration
}

// Read the bid history from Redis
async function readBidHistoryFromRedis(itemId) {
    const itemKey = `item:${itemId}:bids`;

    // Get the entire list of bids from Redis
    const bidHistory = await redisClient.lRange(itemKey, 0, -1);

    // Parse each bid entry (since they're stored as JSON strings)
    return bidHistory.map(bid => JSON.parse(bid));
}

// Update the current price in Redis
async function updateCurrentPriceInRedis(itemId, currentPrice) {
    const priceKey = `item:${itemId}:currentPrice`;

    // Set the current price in Redis
    await redisClient.set(priceKey, currentPrice);

    // Optionally, set an expiration for the current price key
    await redisClient.expire(priceKey, 86400); // 1 day expiration
}

// Read the current price from Redis
async function readCurrentPriceFromRedis(itemId) {
    const priceKey = `item:${itemId}:currentPrice`;

    return await redisClient.get(priceKey);
}

module.exports = {
    writeBidToRedis,
    readBidHistoryFromRedis,
    updateCurrentPriceInRedis,
    readCurrentPriceFromRedis
};
