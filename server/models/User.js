const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Keeping it simple for student level (no hashing yet)
    role: { type: String, default: "user" }, // "admin" or "user"
    status: { type: String, default: "active" } // "active" or "blocked"
});

const User = mongoose.model('User', userSchema);
module.exports = User;
