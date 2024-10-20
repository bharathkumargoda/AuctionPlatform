const Item = require('../models/item');
const { writeBidToRedis, readBidHistoryFromRedis, updateCurrentPriceInRedis } = require('./redisHelper');
const redisClient = require('../config/redis');

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Client joins an auction room
        socket.on('joinAuction', async ({ auctionId }) => {
            socket.join(auctionId);
            console.log(`Client ${socket.id} joined auction room: ${auctionId}`);

            // Fetch bid history from Redis for the item and send to client
            const itemId = auctionId; // Assuming auctionId == itemId
            const bidHistory = await readBidHistoryFromRedis(itemId);

            // Send the current bid history to the client
            socket.emit('bidHistory', bidHistory);
        });

        // Handle bid placement via WebSocket
        socket.on('placeBid', async ({ itemId, userId, bidAmount }) => {
            try {
                // Fetch the current price from Redis
                let currentPrice = await redisClient.get(`item:${itemId}:currentPrice`);
                currentPrice = parseFloat(currentPrice);

                // Validate bid amount against current price and minimum increment
                const item = await Item.findById(itemId).populate('auction');
                const auction = item.auction;
                if (bidAmount < currentPrice + auction.minimumBidIncrement) {
                    return socket.emit('bidError', 'Bid must be higher than the current price by the minimum increment.');
                }

                // Create new bid with a timestamp
                const newBid = {
                    userId,
                    amount: bidAmount,
                    timestamp: new Date(),
                };

                // Write the new bid to Redis
                await writeBidToRedis(itemId, newBid);
                await updateCurrentPriceInRedis(itemId, bidAmount);

                // Broadcast the new bid to everyone in the auction room
                io.to(auction._id).emit('newBid', { itemId: item._id, bids: [newBid] });

                // Asynchronously persist the bid to MongoDB
                setImmediate(async () => {
                    item.bids.push(newBid);
                    item.currentPrice = bidAmount;
                    await item.save();
                });

            } catch (error) {
                console.error('Error placing bid:', error);
                socket.emit('bidError', 'Error processing bid.');
            }
        });

        // Disconnect WebSocket
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;






























// const Item = require('../models/item');
// const redisClient = require('../db/redis');
// const mongoose = require('mongoose');

// const socketHandler = (io) => {
//     io.on('connection', (socket) => {
//         console.log('New client connected:', socket.id);

//         // Client joins an auction room
//         socket.on('joinAuction', async ({ auctionId }) => {
//             socket.join(auctionId);
//             console.log(`Client ${socket.id} joined auction room: ${auctionId}`);
//         });

//         // Handle bid placement via WebSocket
//         socket.on('placeBid', async ({ itemId, userId, bidAmount }) => {
//             try {
//                 // Fetch item from MongoDB
//                 // Fetch item from MongoDB
//                 let item = await Item.findById(itemId); // Get item without population
//                 console.log('Item before populating auction:', item);

//                 // Now populate the auction
//                 item = await item.populate('auction');
//                 console.log('Item after populating auction:', item);


//                 const userObjectId = new mongoose.Types.ObjectId(userId);

//                 if (!item) {
//                     return socket.emit('bidError', 'Item not found.');
//                 }

//                 // Validate bid amount against current price and minimum increment
//                 if (bidAmount < item.currentPrice + item.minimumBidIncrement) {
//                     return socket.emit('bidError', 'Bid must be higher than the current price by the minimum increment.');
//                 }

//                 // Create new bid with a timestamp
//                 const newBid = {
//                     userId: userObjectId,  // Convert userId to ObjectId
//                     amount: bidAmount,
//                     timestamp: new Date(),
//                 };

//                 // Update bid history and current price
//                 item.bids.push(newBid);
//                 item.currentPrice = bidAmount;
//                 console.log("Auctions", item);
//                 await item.save();

//                 // Update Redis cache for item
//                 // await redisClient.set(`item:${itemId}`, JSON.stringify(item), { EX: 300 });  // Cache for 5 minutes

//                 // Broadcast the new bid to everyone in the auction room
//                 io.to(item.auction._id).emit('newBid', { itemId: item._id, bids: item.bids });
//             } catch (error) {
//                 console.error('Error placing bid:', error);
//                 socket.emit('bidError', 'Error processing bid.');
//             }
//         });

//         // Disconnect WebSocket
//         socket.on('disconnect', () => {
//             console.log('Client disconnected:', socket.id);
//         });
//     });
// };

// module.exports = socketHandler;
