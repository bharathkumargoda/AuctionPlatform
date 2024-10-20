let activeBids = {};

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle incoming bid from a client
    socket.on('placeBid', ({ auctionId, amount }) => {
      if (!activeBids[auctionId]) {
        activeBids[auctionId] = [];
      }

      const bid = {
        id: socket.id,
        amount,
        timestamp: new Date(),
      };

      activeBids[auctionId].push(bid);
      // Broadcast new bid to all clients
      socket.broadcast.emit('newBid', { auctionId, bid });

    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = { initializeSocket };
