const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const BOT_PRICE = 5; // USDT

// Purchase trading bot
router.post('/purchase', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Check if user already has bot
    if (user.hasPurchasedBot) {
      return res.status(400).json({ error: 'You already own a trading bot' });
    }

    // Check if user has sufficient balance
    if (user.balance < BOT_PRICE) {
      return res.status(400).json({ 
        error: `Insufficient balance. You need ${BOT_PRICE} USDT to purchase the bot.` 
      });
    }

    // Deduct bot price from balance
    user.balance -= BOT_PRICE;
    user.hasPurchasedBot = true;
    user.botPurchaseDate = new Date();
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      type: 'bot_purchase',
      amount: BOT_PRICE,
      status: 'completed',
      description: 'Trading bot purchase'
    });

    await transaction.save();

    res.json({
      message: 'Trading bot purchased successfully!',
      newBalance: user.balance,
      botPurchaseDate: user.botPurchaseDate
    });
  } catch (error) {
    console.error('Bot purchase error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bot status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.hasPurchasedBot) {
      return res.json({
        hasPurchasedBot: false,
        botPrice: BOT_PRICE
      });
    }

    const dailyProfit = user.calculateDailyProfit();
    const profitPerTrade = dailyProfit / 12; // 12 trades per day (every 2 hours)

    res.json({
      hasPurchasedBot: true,
      botPurchaseDate: user.botPurchaseDate,
      isActive: user.isActive,
      dailyProfit,
      profitPerTrade,
      lastTradeTime: user.lastTradeTime,
      nextTradeIn: calculateNextTradeTime(user.lastTradeTime)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Calculate time until next trade
function calculateNextTradeTime(lastTradeTime) {
  if (!lastTradeTime) return 'Soon';
  
  const now = new Date();
  const nextTrade = new Date(lastTradeTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours
  const diff = nextTrade - now;
  
  if (diff <= 0) return 'Soon';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

// Get profit table
router.get('/profit-table', (req, res) => {
  res.json([
    { balance: 20.00, dailyProfit: 3.00 },
    { balance: 99.00, dailyProfit: 16.83 },
    { balance: 458.00, dailyProfit: 91.60 },
    { balance: 1288.00, dailyProfit: 283.36 },
    { balance: 4388.00, dailyProfit: 1097.00 },
    { balance: 10888.00, dailyProfit: 3048.64 },
    { balance: 25888.00, dailyProfit: 8284.16 }
  ]);
});

module.exports = router;
