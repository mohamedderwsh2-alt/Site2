import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateProfitPerTrade, calculateDailyProfit } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await req.json()
    const depositAmount = parseFloat(amount)

    if (!depositAmount || depositAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { wallet: true, referrer: true },
    })

    if (!user || !user.wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create deposit transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'deposit',
        amount: depositAmount,
        status: 'completed',
        description: 'Deposit to wallet',
      },
    })

    // Update wallet balance
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          increment: depositAmount,
        },
      },
    })

    // Handle referral commission (5% of deposit)
    if (user.referredBy) {
      const commission = depositAmount * 0.05
      const referrer = await prisma.user.findUnique({
        where: { id: user.referredBy },
        include: { wallet: true },
      })

      if (referrer && referrer.wallet) {
        await prisma.wallet.update({
          where: { userId: referrer.id },
          data: {
            balance: {
              increment: commission,
            },
          },
        })

        await prisma.referralEarning.create({
          data: {
            referrerId: referrer.id,
            referredUserId: user.id,
            type: 'deposit_commission',
            amount: commission,
            description: `5% commission from ${user.email}'s deposit`,
          },
        })
      }
    }

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error('Deposit error:', error)
    return NextResponse.json({ error: 'Deposit failed' }, { status: 500 })
  }
}
