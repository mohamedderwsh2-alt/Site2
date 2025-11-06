import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateProfitPerTrade } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await req.json()
    const purchaseAmount = parseFloat(amount)

    if (!purchaseAmount || purchaseAmount < 5) {
      return NextResponse.json(
        { error: 'Minimum purchase amount is 5 USDT' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { wallet: true },
    })

    if (!user || !user.wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.wallet.balance < purchaseAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Check if user already has an active bot
    const existingBot = await prisma.botPurchase.findUnique({
      where: { userId: user.id },
    })

    if (existingBot && existingBot.isActive) {
      return NextResponse.json(
        { error: 'You already have an active trading bot' },
        { status: 400 }
      )
    }

    // Deduct purchase amount
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: purchaseAmount,
        },
      },
    })

    // Create or update bot purchase
    await prisma.botPurchase.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        purchaseAmount,
        isActive: true,
      },
      update: {
        purchaseAmount,
        isActive: true,
        lastTradeAt: null,
      },
    })

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'purchase',
        amount: purchaseAmount,
        status: 'completed',
        description: 'Trading bot purchase',
      },
    })

    return NextResponse.json({ success: true, message: 'Bot purchased successfully' })
  } catch (error) {
    console.error('Bot purchase error:', error)
    return NextResponse.json(
      { error: 'Bot purchase failed' },
      { status: 500 }
    )
  }
}
