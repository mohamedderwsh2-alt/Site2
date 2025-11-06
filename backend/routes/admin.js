const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');

// Middleware to check if user is admin (you can implement more sophisticated role-based auth)
const isAdmin = async (req, res, next) => {
  // For now, simple check - in production, use proper role-based authentication
  const user = await User.findById(req.userId);
  if (user.email !== 'admin@example.com') { // Change this to your admin email
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get all pending deposits
router.get('/deposits/pending', [auth, isAdmin], async (req, res) => {
  try {
    const deposits = await Transaction.find({
      type: 'deposit',
      status: 'pending'
    }).populate('userId', 'username email').sort({ createdAt: -1 });
    
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve deposit
router.post('/deposits/:id/approve', [auth, isAdmin], async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction || transaction.type !== 'deposit') {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }
    
    // Update transaction status
    transaction.status = 'completed';
    await transaction.save();
    
    // Add balance to user
    const user = await User.findById(transaction.userId);
    const depositAmount = transaction.amount;
    user.balance += depositAmount;
    
    // Check if user was referred and handle referral commission
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });
      if (referrer) {
        // 5% instant commission
        const commission = depositAmount * 0.05;
        referrer.balance += commission;
        referrer.referralEarnings += commission;
        await referrer.save();
        
        // Create commission transaction
        const commissionTx = new Transaction({
          userId: referrer._id,
          type: 'referral_commission',
          amount: commission,
          status: 'completed',
          description: `5% referral commission from ${user.username}'s deposit`
        });
        await commissionTx.save();
      }
    }
    
    await user.save();
    
    res.json({
      message: 'Deposit approved successfully',
      transaction,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all pending withdrawals
router.get('/withdrawals/pending', [auth, isAdmin], async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find({
      status: 'pending'
    }).populate('userId', 'username email').sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve withdrawal
router.post('/withdrawals/:id/approve', [auth, isAdmin], async (req, res) => {
  try {
    const { txHash } = req.body;
    
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }
    
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }
    
    // Update withdrawal status
    withdrawal.status = 'completed';
    withdrawal.txHash = txHash;
    withdrawal.processedAt = new Date();
    await withdrawal.save();
    
    // Update transaction status
    await Transaction.updateOne(
      { userId: withdrawal.userId, type: 'withdrawal', amount: withdrawal.amount, status: 'pending' },
      { status: 'completed', txHash }
    );
    
    res.json({
      message: 'Withdrawal approved successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject withdrawal
router.post('/withdrawals/:id/reject', [auth, isAdmin], async (req, res) => {
  try {
    const { reason } = req.body;
    
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }
    
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }
    
    // Update withdrawal status
    withdrawal.status = 'rejected';
    withdrawal.adminNotes = reason;
    withdrawal.processedAt = new Date();
    await withdrawal.save();
    
    // Return balance to user
    const user = await User.findById(withdrawal.userId);
    user.balance += withdrawal.amount;
    await user.save();
    
    // Update transaction status
    await Transaction.updateOne(
      { userId: withdrawal.userId, type: 'withdrawal', amount: withdrawal.amount, status: 'pending' },
      { status: 'rejected' }
    );
    
    res.json({
      message: 'Withdrawal rejected',
      withdrawal,
      returnedBalance: withdrawal.amount
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get platform statistics
router.get('/stats', [auth, isAdmin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ hasPurchasedBot: true });
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      totalUsers,
      activeUsers,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
