export const demoUser = {
  name: "Serra Yılmaz",
  email: "serra@arbiterx.ai",
  balance: 1288,
  cycleProfit: 23.61,
  dailyProfit: 283.36,
  referralCount: 4,
  referralEarnings: 58.44,
  botCount: 1,
  nextCycleEtaMinutes: 32,
};

export const demoTrades = [
  {
    id: "ARB#184",
    timestamp: "2025-11-06T08:00:00Z",
    spread: 3.4,
    volume: 128.8,
    status: "settled",
    profit: 9.44,
    exchanges: "Binance → OKX",
  },
  {
    id: "ARB#183",
    timestamp: "2025-11-06T06:00:00Z",
    spread: 3.1,
    volume: 122.4,
    status: "settled",
    profit: 8.87,
    exchanges: "OKX → Binance",
  },
  {
    id: "ARB#182",
    timestamp: "2025-11-06T04:00:00Z",
    spread: 3.6,
    volume: 118.2,
    status: "settled",
    profit: 8.49,
    exchanges: "Binance → OKX",
  },
  {
    id: "ARB#181",
    timestamp: "2025-11-06T02:00:00Z",
    spread: 3.0,
    volume: 116.7,
    status: "settled",
    profit: 7.92,
    exchanges: "OKX → Binance",
  },
];

export const demoProfitSchedule = [
  { cycle: "02:00", profit: 7.92 },
  { cycle: "04:00", profit: 8.49 },
  { cycle: "06:00", profit: 8.87 },
  { cycle: "08:00", profit: 9.44 },
];

export const demoReferrals = [
  {
    name: "Kemal A.",
    email: "kemal@example.com",
    deposit: 500,
    instantBonus: 25,
    profitShare: 62.5,
  },
  {
    name: "Mina P.",
    email: "mina@example.com",
    deposit: 100,
    instantBonus: 5,
    profitShare: 12.5,
  },
  {
    name: "Lucas B.",
    email: "lucas@example.com",
    deposit: 50,
    instantBonus: 2.5,
    profitShare: 6.25,
  },
];

export const profitTableTiers = [
  { threshold: 20, profit: 3.0 },
  { threshold: 99, profit: 16.83 },
  { threshold: 458, profit: 91.6 },
  { threshold: 1288, profit: 283.36 },
  { threshold: 4388, profit: 1097 },
  { threshold: 10888, profit: 3048.64 },
  { threshold: 25888, profit: 8284.16 },
];
