// This script should be run every 2 hours using a cron job
// Example: Run with: node scripts/profit-cron.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-trading-bot';

// Import models
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  balance: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  referralCode: String,
  referredBy: String,
  hasPurchasedBot: { type: Boolean, default: false },
  botPurchaseDate: Date,
  withdrawalAddress: String,
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  walletAddress: String,
  description: String,
}, { timestamps: true });

const TradeHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tradeAmount: Number,
  profitAmount: Number,
  balanceAfterTrade: Number,
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  initialDepositCommission: { type: Number, default: 0 },
  totalProfitCommission: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
const TradeHistory = mongoose.models.TradeHistory || mongoose.model('TradeHistory', TradeHistorySchema);
const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);

// Profit calculation based on balance tiers
const profitTiers = [
  { minBalance: 25888, dailyProfit: 8284.16 },
  { minBalance: 10888, dailyProfit: 3048.64 },
  { minBalance: 4388, dailyProfit: 1097.00 },
  { minBalance: 1288, dailyProfit: 283.36 },
  { minBalance: 458, dailyProfit: 91.60 },
  { minBalance: 99, dailyProfit: 16.83 },
  { minBalance: 20, dailyProfit: 3.00 },
];

function calculateTradeProfit(balance) {
  if (balance < 20) return 0;
  
  for (const tier of profitTiers) {
    if (balance >= tier.minBalance) {
      return tier.dailyProfit / 12; // 12 trades per day
    }
  }
  
  return 0;
}

async function runProfitDistribution() {
  try {
    console.log('Starting profit distribution...');
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with active bots
    const activeUsers = await User.find({
      hasPurchasedBot: true,
      balance: { $gte: 20 }
    });

    console.log(`Found ${activeUsers.length} active users`);

    for (const user of activeUsers) {
      const profitAmount = calculateTradeProfit(user.balance);
      
      if (profitAmount > 0) {
        // Add profit to balance
        user.balance += profitAmount;
        user.totalEarnings += profitAmount;
        await user.save();

        // Create trade history record
        await TradeHistory.create({
          userId: user._id,
          tradeAmount: user.balance * 0.1, // 10% of balance used per trade
          profitAmount,
          balanceAfterTrade: user.balance,
          timestamp: new Date(),
        });

        // Create transaction record
        await Transaction.create({
          userId: user._id,
          type: 'profit',
          amount: profitAmount,
          status: 'completed',
          description: 'Automated trade profit',
        });

        console.log(`✓ Distributed ${profitAmount} USDT to user ${user.email}`);

        // Handle referral commissions (20% of profit)
        if (user.referredBy) {
          const referrer = await User.findOne({ referralCode: user.referredBy });
          if (referrer) {
            const commission = profitAmount * 0.20;
            referrer.balance += commission;
            referrer.totalEarnings += commission;
            await referrer.save();

            // Update referral record
            await Referral.findOneAndUpdate(
              { referrerId: referrer._id, referredUserId: user._id },
              { $inc: { totalProfitCommission: commission } }
            );

            // Create transaction for commission
            await Transaction.create({
              userId: referrer._id,
              type: 'referral_commission',
              amount: commission,
              status: 'completed',
              description: `Referral profit commission from ${user.name}`,
            });

            console.log(`  ✓ Paid ${commission} USDT commission to referrer ${referrer.email}`);
          }
        }
      }
    }

    console.log('Profit distribution completed successfully!');
  } catch (error) {
    console.error('Error during profit distribution:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the profit distribution
runProfitDistribution();
