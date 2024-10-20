const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String, // Consider hashing passwords!
});

module.exports = mongoose.model('User', userSchema);
