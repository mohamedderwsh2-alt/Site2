const User = require('../models/User');
const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');

// Simulate trading bot execution
const executeTradingCycle = async () => {
  try {
    console.log('🤖 Starting trading cycle...');
    
    // Find all users with active bots
    const activeUsers = await User.find({ 
      hasPurchasedBot: true,
      isActive: true,
      balance: { $gte: 20 } // Minimum balance to trade
    });
    
    console.log(`Found ${activeUsers.length} active users`);
    
    for (const user of activeUsers) {
      try {
        // Calculate profit for this trade
        const dailyProfit = user.calculateDailyProfit();
        const profitPerTrade = dailyProfit / 12; // 12 trades per day
        
        // Simulate trade execution
        const exchange = Math.random() > 0.5 ? 'binance' : 'okx';
        const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
        const tradeAmount = user.balance * 0.1; // Use 10% of balance
        const priceDifference = 3 + Math.random() * 2; // 3-5% difference
        const executionTime = Math.floor(Math.random() * 50); // 0-50ms
        
        // Create trade record
        const trade = new Trade({
          userId: user._id,
          exchange,
          tradeType,
          amount: tradeAmount,
          profit: profitPerTrade,
          priceDifference,
          executionTime
        });
        
        await trade.save();
        
        // Update user balance and earnings
        user.balance += profitPerTrade;
        user.totalEarnings += profitPerTrade;
        user.lastTradeTime = new Date();
        await user.save();
        
        // Create profit transaction
        const transaction = new Transaction({
          userId: user._id,
          type: 'trade_profit',
          amount: profitPerTrade,
          status: 'completed',
          description: `Trading profit from ${exchange} ${tradeType}`
        });
        
        await transaction.save();
        
        // Handle referral profit sharing (20% of profit)
        if (user.referredBy) {
          const referrer = await User.findOne({ referralCode: user.referredBy });
          if (referrer) {
            const referralProfit = profitPerTrade * 0.2;
            referrer.balance += referralProfit;
            referrer.referralEarnings += referralProfit;
            await referrer.save();
            
            // Create referral profit transaction
            const referralTx = new Transaction({
              userId: referrer._id,
              type: 'referral_profit',
              amount: referralProfit,
              status: 'completed',
              description: `20% profit share from ${user.username}'s trade`
            });
            
            await referralTx.save();
          }
        }
        
        console.log(`✅ Trade executed for user ${user.username}: +${profitPerTrade.toFixed(2)} USDT`);
      } catch (error) {
        console.error(`Error processing trade for user ${user.username}:`, error);
      }
    }
    
    console.log('🤖 Trading cycle completed');
  } catch (error) {
    console.error('Trading cycle error:', error);
  }
};

module.exports = { executeTradingCycle };
