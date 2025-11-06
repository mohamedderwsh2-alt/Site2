import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, walletAddress, password } = await req.json()
    const withdrawAmount = parseFloat(amount)

    if (!withdrawAmount || withdrawAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    if (user.wallet.balance < withdrawAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Create withdrawal transaction (pending status - manual processing)
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'withdraw',
        amount: withdrawAmount,
        status: 'pending',
        description: 'Withdrawal request',
        walletAddress,
      },
    })

    // Deduct from balance
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: withdrawAmount,
        },
      },
    })

    return NextResponse.json({
      success: true,
      transaction,
      message: 'Withdrawal request submitted. It will be processed manually.',
    })
  } catch (error) {
    console.error('Withdraw error:', error)
    return NextResponse.json({ error: 'Withdrawal failed' }, { status: 500 })
  }
}
