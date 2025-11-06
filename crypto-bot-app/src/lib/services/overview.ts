import prisma from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils";
import { runTradingCyclesForUser } from "@/lib/trading";
import { TWO_HOURS_MS, PROFIT_TIERS } from "@/lib/profit";

export const loadOverview = async (userId: string) => {
  await runTradingCyclesForUser(userId);

  const [user, recentTrades, deposits, withdrawals, referrals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        language: true,
        referralCode: true,
        balance: true,
        availableBalance: true,
        totalDeposited: true,
        totalProfit: true,
        totalWithdrawn: true,
        referralEarnings: true,
        lastTradeAt: true,
        tradeCyclesRun: true,
        createdAt: true,
        referredById: true,
      },
    }),
    prisma.trade.findMany({
      where: { userId },
      orderBy: { executedAt: "desc" },
      take: 5,
    }),
    prisma.deposit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      where: { referredById: userId },
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        totalDeposited: true,
        totalProfit: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const nextCycleAtBase = user.lastTradeAt ?? user.createdAt;
  const nextCycleAt = new Date(nextCycleAtBase.getTime() + TWO_HOURS_MS);

  const referralStats = referrals.reduce(
    (acc, referral) => {
      const deposited = decimalToNumber(referral.totalDeposited);
      const profit = decimalToNumber(referral.totalProfit);

      acc.total += 1;
      acc.totalDeposited += deposited;
      acc.totalProfit += profit;
      if (deposited > 0) acc.active += 1;
      return acc;
    },
    { total: 0, active: 0, totalDeposited: 0, totalProfit: 0 },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      language: user.language,
      referralCode: user.referralCode,
      balance: decimalToNumber(user.balance),
      availableBalance: decimalToNumber(user.availableBalance),
      totalDeposited: decimalToNumber(user.totalDeposited),
      totalProfit: decimalToNumber(user.totalProfit),
      totalWithdrawn: decimalToNumber(user.totalWithdrawn),
      referralEarnings: decimalToNumber(user.referralEarnings),
      lastTradeAt: user.lastTradeAt?.toISOString() ?? null,
      tradeCyclesRun: user.tradeCyclesRun,
      createdAt: user.createdAt.toISOString(),
      nextCycleAt: nextCycleAt.toISOString(),
    },
    trading: {
      profitTable: PROFIT_TIERS,
      nextCycleAt: nextCycleAt.toISOString(),
      recentTrades: recentTrades.map((trade) => ({
        id: trade.id,
        executedAt: trade.executedAt.toISOString(),
        tradeAmount: decimalToNumber(trade.tradeAmount),
        profit: decimalToNumber(trade.profit),
        cycleIndex: trade.cycleIndex,
      })),
    },
    wallet: {
      deposits: deposits.map((deposit) => ({
        id: deposit.id,
        amount: decimalToNumber(deposit.amount),
        status: deposit.status,
        createdAt: deposit.createdAt.toISOString(),
        txHash: deposit.txHash,
      })),
      withdrawals: withdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        amount: decimalToNumber(withdrawal.amount),
        status: withdrawal.status,
        createdAt: withdrawal.createdAt.toISOString(),
        address: withdrawal.address,
      })),
    },
    referrals: {
      stats: referralStats,
      list: referrals.map((referral) => ({
        id: referral.id,
        name: referral.name,
        email: referral.email,
        totalDeposited: decimalToNumber(referral.totalDeposited),
        totalProfit: decimalToNumber(referral.totalProfit),
        createdAt: referral.createdAt.toISOString(),
      })),
    },
  } as const;
};

export type OverviewData = Awaited<ReturnType<typeof loadOverview>>;
