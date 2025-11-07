const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exchange: {
    type: String,
    enum: ['binance', 'okx'],
    required: true
  },
  tradeType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  priceDifference: {
    type: Number,
    required: true
  },
  executionTime: {
    type: Number, // milliseconds
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema);
