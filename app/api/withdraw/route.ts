import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { MIN_WITHDRAWAL, validateUSDTAddress } from '@/lib/profitCalculator';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, walletAddress, password } = await request.json();

    // Validation
    if (!amount || !walletAddress || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount < MIN_WITHDRAWAL) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} USDT` },
        { status: 400 }
      );
    }

    if (!validateUSDTAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid USDT wallet address' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Check balance
    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct amount from balance
    user.balance -= amount;
    user.withdrawalAddress = walletAddress;
    await user.save();

    // Create withdrawal transaction
    await Transaction.create({
      userId: user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      walletAddress,
      description: 'Withdrawal request',
    });

    return NextResponse.json({
      message: 'Withdrawal request submitted successfully',
      balance: user.balance,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
