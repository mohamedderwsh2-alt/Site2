// API route for user authentication
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// In-memory user storage (replace with database in production)
const users: any[] = []

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, action } = body

    if (action === 'register') {
      // Registration
      const { confirmPassword, referralCode } = body

      if (password !== confirmPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
      }

      // Check if user exists
      if (users.find(u => u.email === email)) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Generate referral code
      const userReferralCode = 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase()

      const newUser = {
        id: Date.now().toString(),
        email,
        password: hashedPassword,
        balance: 0,
        referralCode: userReferralCode,
        referredBy: referralCode || null,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)

      // Generate token
      const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, {
        expiresIn: '30d',
      })

      return NextResponse.json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          balance: newUser.balance,
          referralCode: newUser.referralCode,
        },
      }, { status: 201 })
    } else if (action === 'login') {
      // Login
      const user = users.find(u => u.email === email)

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
        expiresIn: '30d',
      })

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          balance: user.balance,
          referralCode: user.referralCode,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
