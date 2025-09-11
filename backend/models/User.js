// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wishlist: { type: Array, default: [] }, // <-- Add this line
});

module.exports = mongoose.model('User', userSchema);
