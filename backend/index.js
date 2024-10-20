const express = require('express');
const connectMongoDB = require('./db/mongo'); // MongoDB connection
const { redisClient, connectRedis } = require('./db/redis'); // Redis connection
const auctionRoutes = require('./routes/auctionRoutes');
const itemRoutes = require('./routes/itemRoutes');
const socketIO = require('socket.io');
const auctionSocket = require('./sockets/auctionSocket'); 
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use('/api/auctions', auctionRoutes);
app.use('/api/items', itemRoutes);




// Connect to MongoDB and Redis
connectMongoDB();
connectRedis();
auctionSocket(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
