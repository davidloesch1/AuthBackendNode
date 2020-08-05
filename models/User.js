const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  image: {
      type: String,
  }
});

module.exports = mongoose.model('User', UserSchema)