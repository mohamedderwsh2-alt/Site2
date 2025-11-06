import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
    const totalEarnings = users.reduce((sum, user) => sum + user.totalEarnings, 0);
    const activeUsers = users.filter(user => user.hasPurchasedBot).length;

    return NextResponse.json({
      users,
      stats: {
        totalUsers: users.length,
        activeUsers,
        totalBalance,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
