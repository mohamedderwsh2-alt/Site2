const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  dailyProfit: {
    type: Number,
    default: 0
  },
  hasPurchasedBot: {
    type: Boolean,
    default: false
  },
  botPurchaseDate: {
    type: Date
  },
  walletAddress: {
    type: String,
    default: ''
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  referredBy: {
    type: String,
    default: null
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  referralCount: {
    type: Number,
    default: 0
  },
  language: {
    type: String,
    default: 'en'
  },
  lastTradeTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate daily profit based on balance
userSchema.methods.calculateDailyProfit = function() {
  const balance = this.balance;
  
  const profitTable = [
    { balance: 20, profit: 3 },
    { balance: 99, profit: 16.83 },
    { balance: 458, profit: 91.60 },
    { balance: 1288, profit: 283.36 },
    { balance: 4388, profit: 1097.00 },
    { balance: 10888, profit: 3048.64 },
    { balance: 25888, profit: 8284.16 }
  ];
  
  // Find appropriate profit tier
  for (let i = profitTable.length - 1; i >= 0; i--) {
    if (balance >= profitTable[i].balance) {
      // Calculate proportional profit
      if (i < profitTable.length - 1) {
        const lower = profitTable[i];
        const upper = profitTable[i + 1];
        const ratio = (balance - lower.balance) / (upper.balance - lower.balance);
        return lower.profit + (upper.profit - lower.profit) * ratio;
      }
      return profitTable[i].profit;
    }
  }
  
  // If balance is below minimum, calculate proportionally
  if (balance >= 20) {
    return (balance / 20) * 3;
  }
  
  return 0;
};

module.exports = mongoose.model('User', userSchema);
