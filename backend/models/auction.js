const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    title: String,
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    startDate: Date,
    endDate: Date,
    minimumBidIncrement: { type: Number, default: 5 },
    auctionType: { type: String, enum: ['English', 'Dutch', 'Sealed-Bid'] },
});

module.exports = mongoose.model('Auction', auctionSchema);
