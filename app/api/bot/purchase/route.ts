import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { BOT_PRICE } from '@/lib/profitCalculator';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    if (user.hasPurchasedBot) {
      return NextResponse.json(
        { error: 'Bot already purchased' },
        { status: 400 }
      );
    }

    if (user.balance < BOT_PRICE) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct bot price from balance
    user.balance -= BOT_PRICE;
    user.hasPurchasedBot = true;
    user.botPurchaseDate = new Date();
    await user.save();

    // Create transaction record
    await Transaction.create({
      userId: user._id,
      type: 'bot_purchase',
      amount: BOT_PRICE,
      status: 'completed',
      description: 'Trading bot purchase',
    });

    return NextResponse.json({
      message: 'Bot purchased successfully',
      balance: user.balance,
    });
  } catch (error) {
    console.error('Bot purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
