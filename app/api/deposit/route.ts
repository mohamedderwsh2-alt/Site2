import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return the deposit wallet address from environment variable
    const depositAddress = process.env.DEPOSIT_WALLET_ADDRESS || 'TYourUSDTWalletAddressHere123456789';

    return NextResponse.json({
      depositAddress,
      network: 'TRC20',
      currency: 'USDT',
    });
  } catch (error) {
    console.error('Deposit address fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
