import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// Check if user is admin
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const withdrawals = await Transaction.find({
      type: 'withdrawal',
      status,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error('Admin withdrawals fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const { transactionId, status } = await request.json();

    if (!['completed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await dbConnect();

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: 'Transaction already processed' },
        { status: 400 }
      );
    }

    // If rejected, return the amount to user balance
    if (status === 'rejected') {
      const user = await User.findById(transaction.userId);
      if (user) {
        user.balance += transaction.amount;
        await user.save();
      }
    }

    transaction.status = status;
    await transaction.save();

    return NextResponse.json({
      message: `Withdrawal ${status} successfully`,
      transaction,
    });
  } catch (error) {
    console.error('Admin withdrawal update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
