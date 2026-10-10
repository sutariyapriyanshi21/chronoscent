const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Keeping it simple for student level (no hashing yet)
});

const User = mongoose.model('User', userSchema);
module.exports = User;
