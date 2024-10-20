const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if the connection fails
    }
};

module.exports = connectMongoDB;
