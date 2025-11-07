import { addHours, startOfDay } from "date-fns";

import { estimateCycleProfit, estimateDailyProfit } from "@/lib/profit";
import { prisma } from "@/server/db";

export async function getDashboardSnapshot(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      walletBalance: true,
      botPrincipal: true,
      totalDeposited: true,
      totalWithdrawn: true,
      totalEarnings: true,
      totalReferralEarnings: true,
      botActive: true,
      botPurchasedAt: true,
      lastProfitDistribution: true,
      referralCode: true,
      language: true,
      referrals: {
        select: { id: true, createdAt: true },
      },
      referredById: true,
    },
  });

  if (!user) return null;

  const principal = Number(user.botPrincipal);
  const dailyProfit = estimateDailyProfit(principal);
  const cycleProfit = estimateCycleProfit(principal);
  const nextTrade =
    user.lastProfitDistribution && user.botActive
      ? addHours(user.lastProfitDistribution, 2)
      : null;

  const startOfToday = startOfDay(new Date());

  const [recentTrades, recentTransactions, referralEarnings, todayAgg] =
    await Promise.all([
      prisma.botTrade.findMany({
        where: { userId },
        orderBy: { tradeWindowEnd: "desc" },
        take: 30,
      }),
      prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.referralReward.aggregate({
        where: { referrerId: userId },
        _sum: { amount: true },
      }),
      prisma.botTrade.aggregate({
        where: { userId, tradeWindowEnd: { gte: startOfToday } },
        _sum: { profitAmount: true },
        _count: { _all: true },
      }),
    ]);

  const referralCount = user.referrals.length;

  return {
    user,
    stats: {
      principal,
      dailyProfit,
      cycleProfit,
      nextTrade,
      referralCount,
      referralVolume: Number(referralEarnings._sum.amount ?? 0),
      today: {
        profit: Number(todayAgg._sum.profitAmount ?? 0),
        cycles: todayAgg._count._all ?? 0,
      },
    },
    recentTrades,
    recentTransactions,
  };
}

export async function getArticles() {
  return [
    {
      slug: "how-does-the-bot-generate-profit",
      title: "How Does the Bot Generate Profit?",
      body: [
        "Our trading bot continuously monitors price spreads between OKX and Binance.",
        "Every two hours, it runs a set of micro-strategies to capture spreads larger than 3%.",
        "Only 10% of each user balance is deployed per transaction, protecting capital during volatility.",
        "Each arbitrage execution finishes in under 50 milliseconds and profits are distributed to all active users.",
        "A small portion of the spread covers infrastructure and engineering costs, guaranteeing sustainable growth.",
      ],
    },
    {
      slug: "security-and-risk-controls",
      title: "Security & Risk Controls",
      body: [
        "Two exchanges, redundant infrastructure, and latency-aware routing keep the system resilient.",
        "Smart throttling prevents overexposure to a single market.",
        "Manual withdrawal approval adds a defense against malicious actors.",
      ],
    },
    {
      slug: "getting-started",
      title: "Getting Started",
      body: [
        "Create an account, deposit at least 20 USDT, and purchase your bot license.",
        "As soon as the bot is active, the first trade executes within the next two-hour cycle.",
        "Monitor your earnings and referrals in the dashboard, or use the mobile-style bottom tabs.",
      ],
    },
  ];
}
