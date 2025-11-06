export const TWO_HOURS_MS = 1000 * 60 * 60 * 2;

export const PROFIT_TIERS = [
  { balance: 20, dailyProfit: 3 },
  { balance: 99, dailyProfit: 16.83 },
  { balance: 458, dailyProfit: 91.6 },
  { balance: 1288, dailyProfit: 283.36 },
  { balance: 4388, dailyProfit: 1097 },
  { balance: 10888, dailyProfit: 3048.64 },
  { balance: 25888, dailyProfit: 8284.16 },
];

export const PROFIT_SHARE_RATE = 0.2;
export const REFERRAL_DEPOSIT_BONUS = 0.05;

const DEFAULT_DAILY_MULTIPLIER =
  PROFIT_TIERS[PROFIT_TIERS.length - 1].dailyProfit /
  PROFIT_TIERS[PROFIT_TIERS.length - 1].balance;

export const roundTo = (value: number, precision = 2) =>
  Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

export const calculateDailyProfit = (balance: number) => {
  if (balance <= 0) return 0;

  const tiers = PROFIT_TIERS;

  if (balance <= tiers[0].balance) {
    const ratio = balance / tiers[0].balance;
    return roundTo(tiers[0].dailyProfit * ratio);
  }

  for (let i = 1; i < tiers.length; i += 1) {
    const tier = tiers[i];
    const previous = tiers[i - 1];

    if (balance <= tier.balance) {
      const span = tier.balance - previous.balance;
      const distance = balance - previous.balance;
      const interpolation = distance / span;
      return roundTo(
        previous.dailyProfit + interpolation * (tier.dailyProfit - previous.dailyProfit),
      );
    }
  }

  return roundTo(balance * DEFAULT_DAILY_MULTIPLIER);
};
