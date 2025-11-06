import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import TradeHistory from '@/models/TradeHistory';

async function isAdmin(userId: string): Promise<boolean> {
  await dbConnect();
  const user = await User.findById(userId);
  return user?.email === process.env.ADMIN_EMAIL;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ hasPurchasedBot: true });
    
    const users = await User.find();
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
    const totalEarnings = users.reduce((sum, user) => sum + user.totalEarnings, 0);

    // Get transaction statistics
    const pendingWithdrawals = await Transaction.countDocuments({
      type: 'withdrawal',
      status: 'pending',
    });

    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get trade statistics
    const totalTrades = await TradeHistory.countDocuments();
    const tradesLast24h = await TradeHistory.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      finances: {
        totalBalance,
        totalEarnings,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
      },
      transactions: {
        pendingWithdrawals,
      },
      trades: {
        total: totalTrades,
        last24h: tradesLast24h,
      },
    });
  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
