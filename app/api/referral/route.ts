import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Referral from '@/models/Referral';

export async function GET(request: NextRequest) {
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

    // Get referral statistics
    const referrals = await Referral.find({ referrerId: user._id })
      .populate('referredUserId', 'name email createdAt');

    const totalCommission = referrals.reduce(
      (sum, ref) => sum + ref.initialDepositCommission + ref.totalProfitCommission,
      0
    );

    return NextResponse.json({
      referralCode: user.referralCode,
      referrals: referrals.map(ref => ({
        user: ref.referredUserId,
        depositCommission: ref.initialDepositCommission,
        profitCommission: ref.totalProfitCommission,
        totalCommission: ref.initialDepositCommission + ref.totalProfitCommission,
      })),
      totalCommission,
      referralCount: referrals.length,
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
