import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateProfitPerTrade } from '@/lib/utils'

// This endpoint simulates the bot trade execution (should be called every 2 hours)
export async function POST(req: NextRequest) {
  try {
    // In production, this should be protected with an API key or cron job
    const allBots = await prisma.botPurchase.findMany({
      where: { isActive: true },
      include: {
        user: {
          include: {
            wallet: true,
            referrer: true,
          },
        },
      },
    })

    const results = []

    for (const bot of allBots) {
      if (!bot.user.wallet) continue

      const profitPerTrade = calculateProfitPerTrade(bot.user.wallet.balance)
      
      // Update wallet
      await prisma.wallet.update({
        where: { userId: bot.user.id },
        data: {
          balance: {
            increment: profitPerTrade,
          },
          totalEarned: {
            increment: profitPerTrade,
          },
        },
      })

      // Create profit transaction
      await prisma.transaction.create({
        data: {
          userId: bot.user.id,
          type: 'profit',
          amount: profitPerTrade,
          status: 'completed',
          description: 'Trading bot profit (2-hour trade)',
        },
      })

      // Handle referral profit commission (20% of profit)
      if (bot.user.referredBy) {
        const commission = profitPerTrade * 0.2
        const referrer = await prisma.user.findUnique({
          where: { id: bot.user.referredBy },
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
              referredUserId: bot.user.id,
              type: 'profit_commission',
              amount: commission,
              description: `20% commission from ${bot.user.email}'s profit`,
            },
          })
        }
      }

      // Update bot last trade time
      await prisma.botPurchase.update({
        where: { id: bot.id },
        data: {
          lastTradeAt: new Date(),
        },
      })

      results.push({
        userId: bot.user.id,
        profit: profitPerTrade,
      })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Bot trade execution error:', error)
    return NextResponse.json(
      { error: 'Trade execution failed' },
      { status: 500 }
    )
  }
}
