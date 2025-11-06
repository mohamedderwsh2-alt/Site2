const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');

// Get deposit address
router.get('/deposit-address', auth, async (req, res) => {
  try {
    res.json({
      address: process.env.ADMIN_WALLET_ADDRESS,
      network: 'TRC20',
      currency: 'USDT',
      note: 'Send only USDT (TRC20) to this address'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Record deposit (manual confirmation by admin)
router.post('/deposit', [
  auth,
  body('amount').isFloat({ min: 1 }),
  body('txHash').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, txHash } = req.body;

    // Create pending transaction
    const transaction = new Transaction({
      userId: req.userId,
      type: 'deposit',
      amount,
      status: 'pending',
      txHash,
      description: `Deposit of ${amount} USDT`
    });

    await transaction.save();

    res.json({
      message: 'Deposit request submitted. Please wait for admin confirmation.',
      transaction
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Request withdrawal
router.post('/withdraw', [
  auth,
  body('amount').isFloat({ min: 1 }),
  body('walletAddress').isLength({ min: 10 }),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, walletAddress, password } = req.body;

    // Verify user password
    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      userId: req.userId,
      amount,
      walletAddress,
      status: 'pending'
    });

    await withdrawalRequest.save();

    // Deduct from user balance (pending)
    user.balance -= amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      type: 'withdrawal',
      amount,
      status: 'pending',
      walletAddress,
      description: `Withdrawal of ${amount} USDT to ${walletAddress}`
    });

    await transaction.save();

    res.json({
      message: 'Withdrawal request submitted successfully',
      withdrawalRequest,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get withdrawal requests
router.get('/withdrawals', auth, async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
