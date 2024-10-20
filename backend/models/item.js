const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    startingPrice: Number,
    currentPrice: { type: Number, default: 0 },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    bids: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            amount: Number,
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('Item', itemSchema);
