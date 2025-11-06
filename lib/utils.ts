import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      wallet: true,
      botPurchase: true,
    },
  })

  return user
}

// Profit calculation based on balance
export function calculateDailyProfit(balance: number): number {
  const profitTable: { balance: number; profit: number }[] = [
    { balance: 20, profit: 3 },
    { balance: 99, profit: 16.83 },
    { balance: 458, profit: 91.6 },
    { balance: 1288, profit: 283.36 },
    { balance: 4388, profit: 1097 },
    { balance: 10888, profit: 3048.64 },
    { balance: 25888, profit: 8284.16 },
  ]

  // Find the closest match or interpolate
  for (let i = 0; i < profitTable.length; i++) {
    if (balance <= profitTable[i].balance) {
      if (i === 0) {
        return profitTable[0].profit
      }
      // Linear interpolation
      const prev = profitTable[i - 1]
      const curr = profitTable[i]
      const ratio = (balance - prev.balance) / (curr.balance - prev.balance)
      return prev.profit + (curr.profit - prev.profit) * ratio
    }
  }

  // If balance exceeds max, use the last entry's ratio
  const last = profitTable[profitTable.length - 1]
  const ratio = balance / last.balance
  return last.profit * ratio
}

export function calculateProfitPerTrade(balance: number): number {
  const dailyProfit = calculateDailyProfit(balance)
  // 12 trades per day (every 2 hours)
  return dailyProfit / 12
}
