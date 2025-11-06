// API route for user data operations
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// In-memory storage (replace with database)
const users: any[] = []
const withdrawals: any[] = []

export async function GET(req: NextRequest) {
  // Verify token
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const userId = decoded.userId

    // Get user data
    const user = users.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        balance: user.balance,
        referralCode: user.referralCode,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  // Verify token
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const userId = decoded.userId
    const body = await req.json()
    const { action } = body

    if (action === 'deposit') {
      // Handle deposit (in production, verify blockchain transaction)
      const { amount } = body
      const user = users.find(u => u.id === userId)
      
      if (user) {
        user.balance += parseFloat(amount)
        
        // Handle referral commission
        if (user.referredBy) {
          const referrer = users.find(u => u.referralCode === user.referredBy)
          if (referrer) {
            const commission = parseFloat(amount) * 0.05
            referrer.balance += commission
          }
        }
      }

      return NextResponse.json({ success: true, balance: user?.balance })
    } else if (action === 'withdraw') {
      // Handle withdrawal request
      const { amount, walletAddress, password } = body
      const user = users.find(u => u.id === userId)

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (user.balance < parseFloat(amount)) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
      }

      // In production, verify password
      withdrawals.push({
        userId,
        amount: parseFloat(amount),
        walletAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })

      return NextResponse.json({ success: true, message: 'Withdrawal request submitted' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
