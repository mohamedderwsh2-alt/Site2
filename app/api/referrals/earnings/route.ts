import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const earnings = await prisma.referralEarning.findMany({
      where: { referrerId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({ success: true, earnings })
  } catch (error) {
    console.error('Error fetching referral earnings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    )
  }
}
