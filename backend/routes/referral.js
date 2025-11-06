const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get referral info
router.get('/info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    // Get referred users
    const referredUsers = await User.find({ 
      referredBy: user.referralCode 
    }).select('username balance totalEarnings createdAt');
    
    res.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      referralEarnings: user.referralEarnings,
      referredUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get referral earnings history
router.get('/earnings', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.userId,
      type: { $in: ['referral_commission', 'referral_profit'] }
    }).sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
  try {
    const user = await User.findOne({ referralCode: req.params.code });
    
    if (!user) {
      return res.status(404).json({ valid: false, error: 'Invalid referral code' });
    }
    
    res.json({ 
      valid: true, 
      referrer: user.username 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
