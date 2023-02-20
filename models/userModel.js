const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cookieId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
