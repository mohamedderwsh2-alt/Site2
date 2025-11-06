// Utility functions for profit calculation

export interface ProfitTier {
  balance: number
  profit: number
}

export const PROFIT_TIERS: ProfitTier[] = [
  { balance: 20.0, profit: 3.0 },
  { balance: 99.0, profit: 16.83 },
  { balance: 458.0, profit: 91.6 },
  { balance: 1288.0, profit: 283.36 },
  { balance: 4388.0, profit: 1097.0 },
  { balance: 10888.0, profit: 3048.64 },
  { balance: 25888.0, profit: 8284.16 },
]

/**
 * Calculate daily profit based on user balance
 */
export function calculateDailyProfit(balance: number): number {
  // Find the highest tier the balance qualifies for
  for (let i = PROFIT_TIERS.length - 1; i >= 0; i--) {
    if (balance >= PROFIT_TIERS[i].balance) {
      return PROFIT_TIERS[i].profit
    }
  }
  
  // Default: 15% for balances below minimum tier
  return balance * 0.15
}

/**
 * Calculate profit per trade (daily profit / 12 trades)
 */
export function calculateProfitPerTrade(balance: number): number {
  const dailyProfit = calculateDailyProfit(balance)
  return dailyProfit / 12 // 12 trades per day (every 2 hours)
}

/**
 * Generate a unique referral code
 */
export function generateReferralCode(): string {
  return 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

/**
 * Calculate referral commission (5% of deposit)
 */
export function calculateDepositCommission(depositAmount: number): number {
  return depositAmount * 0.05
}

/**
 * Calculate referral profit share (20% of profits)
 */
export function calculateProfitShare(profitAmount: number): number {
  return profitAmount * 0.20
}
