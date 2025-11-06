// Profit calculation based on balance tiers
export const profitTiers = [
  { minBalance: 25888, dailyProfit: 8284.16 },
  { minBalance: 10888, dailyProfit: 3048.64 },
  { minBalance: 4388, dailyProfit: 1097.00 },
  { minBalance: 1288, dailyProfit: 283.36 },
  { minBalance: 458, dailyProfit: 91.60 },
  { minBalance: 99, dailyProfit: 16.83 },
  { minBalance: 20, dailyProfit: 3.00 },
];

export function calculateDailyProfit(balance: number): number {
  if (balance < 20) return 0;
  
  // Find the appropriate tier
  for (const tier of profitTiers) {
    if (balance >= tier.minBalance) {
      return tier.dailyProfit;
    }
  }
  
  return 0;
}

export function calculateTradeProfit(balance: number): number {
  // 12 trades per day (every 2 hours)
  const dailyProfit = calculateDailyProfit(balance);
  return dailyProfit / 12;
}

export function calculateReferralCommission(amount: number, type: 'deposit' | 'profit'): number {
  if (type === 'deposit') {
    return amount * 0.05; // 5% on initial deposit
  } else {
    return amount * 0.20; // 20% on profits
  }
}

export const BOT_PRICE = 5; // USDT
export const MIN_WITHDRAWAL = 10; // USDT
