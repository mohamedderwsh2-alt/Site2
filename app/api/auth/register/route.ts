import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { calculateProfitPerTrade, calculateDailyProfit } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, referralCode } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle referral
    let referredBy = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
      })
      if (referrer) {
        referredBy = referrer.id
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        referredBy,
      },
    })

    // Create wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        totalEarned: 0,
      },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
