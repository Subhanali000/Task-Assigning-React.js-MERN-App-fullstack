const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // ← add this
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String, required: true },
  joinedAt: {
    type: Date,
    default: Date.now, // Automatically set if not provided
  },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
});

module.exports = mongoose.model('User', userSchema); // ← Unified name
