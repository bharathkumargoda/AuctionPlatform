import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend server URL

export const placeBid = (auctionId, amount) => {
  socket.emit('placeBid', { auctionId, amount });
};

export const subscribeToBids = (cb) => {
  socket.on('newBid', cb);
};
