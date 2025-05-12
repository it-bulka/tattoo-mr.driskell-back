const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  ip: {
    type: String
  },
  agentType: {
    type: String
  },
  // for multi sessions
  deviceId: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', TokenSchema)