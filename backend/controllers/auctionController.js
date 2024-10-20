const Auction = require('../models/auction');
const Item = require('../models/item');
const { redisClient } = require('../db/redis');

// Get today's auctions (rooms)
const getTodaysAuctions = async (req, res) => {
    const today = new Date();
    const cacheKey = 'todaysAuctions';

    // Try to get data from Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }

    // If not cached, query MongoDB
    const auctions = await Auction.find().populate('items');

    // Store in Redis for future requests
    // await redisClient.set(cacheKey, JSON.stringify(auctions), { EX: 300 }); // Cache for 5 minutes

    res.json(auctions);
};

const getAuctionDetails = async (req, res) =>{
    try {
        const auctionId = req.params.id;
        console.log("Auction Id", auctionId);

        const auction = await Auction.findById(auctionId).populate('items'); // Populate items if necessary

        console.log("Auctions", auction);
        if (!auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }

        res.json(auction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Create a new auction
const createAuction = async (req, res) => {
    const { title, startTime, endTime, minimumBidIncrement, items } = req.body;

    try {
        // First, create items and store them in the database
        const itemIds = await Promise.all(
            items.map(async (itemData) => {
                const newItem = new Item({ 
                    name: itemData.name, 
                    currentPrice: itemData.startingPrice,
                });
                await newItem.save();
                return newItem._id; // Return the item's ID
            })
        );

        // Create the auction with the item IDs
        const newAuction = new Auction({
            title,
            startTime,
            endTime,
            minimumBidIncrement,
            items: itemIds, // Assign created item IDs to the auction
        });

        await newAuction.save();
        res.status(201).json(newAuction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating auction' });
    }
};


module.exports = { getTodaysAuctions, createAuction, getAuctionDetails };
