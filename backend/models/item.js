const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true }, // Initially set to the starting price
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }, // Reference to auction
    minimumBidIncrement : {type : Number, required : true},
    bids: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            amount: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }, // Add timestamp for each bid
        },
    ],
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
