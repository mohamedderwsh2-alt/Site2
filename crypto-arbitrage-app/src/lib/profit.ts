export const PROFIT_CYCLES_PER_DAY = 12; // every 2 hours

export const PROFIT_TIERS = [
  { balance: 20, dailyProfit: 3 },
  { balance: 99, dailyProfit: 16.83 },
  { balance: 458, dailyProfit: 91.6 },
  { balance: 1288, dailyProfit: 283.36 },
  { balance: 4388, dailyProfit: 1097 },
  { balance: 10888, dailyProfit: 3048.64 },
  { balance: 25888, dailyProfit: 8284.16 },
] as const;

export function estimateDailyProfit(balance: number) {
  if (balance <= 0) return 0;
  if (balance <= PROFIT_TIERS[0].balance) {
    const ratio = balance / PROFIT_TIERS[0].balance;
    return PROFIT_TIERS[0].dailyProfit * ratio;
  }

  for (let i = 0; i < PROFIT_TIERS.length - 1; i++) {
    const current = PROFIT_TIERS[i];
    const next = PROFIT_TIERS[i + 1];
    if (balance <= next.balance) {
      const range = next.balance - current.balance;
      const progress = (balance - current.balance) / range;
      const profitRange = next.dailyProfit - current.dailyProfit;
      return current.dailyProfit + profitRange * progress;
    }
  }

  const last = PROFIT_TIERS[PROFIT_TIERS.length - 1];
  const growthRatio = last.dailyProfit / last.balance;
  return balance * growthRatio;
}

export function estimateCycleProfit(balance: number) {
  return estimateDailyProfit(balance) / PROFIT_CYCLES_PER_DAY;
}

export function projectEarnings(balance: number, days: number) {
  const dailyProfit = estimateDailyProfit(balance);
  const totalProfit = dailyProfit * days;
  const cycles = days * PROFIT_CYCLES_PER_DAY;
  return {
    dailyProfit,
    totalProfit,
    cycles,
    cycleProfit: dailyProfit / PROFIT_CYCLES_PER_DAY,
  };
}
