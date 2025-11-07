import { formatISO } from "date-fns";
import type { Prisma } from "@/generated/prisma/client";

import { estimateCycleProfit } from "@/lib/profit";
import { prisma } from "@/server/db";
import { recordReferralProfitShare } from "@/server/services/referrals";

const CYCLE_DURATION_MS = 2 * 60 * 60 * 1000;

function createStrategySnapshot({
  okxPrice,
  binancePrice,
  spread,
}: {
  okxPrice: number;
  binancePrice: number;
  spread: number;
}) {
  return JSON.stringify({
    okxPrice,
    binancePrice,
    spread,
    timestamp: formatISO(new Date()),
  });
}

export async function syncBotTradesForUser(userId: string, now = new Date()) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      botActive: true,
      botPrincipal: true,
      botPurchasedAt: true,
      lastProfitDistribution: true,
      referredById: true,
    },
  });

  if (
    !user ||
    !user.botActive ||
    !user.botPurchasedAt ||
    Number(user.botPrincipal) <= 0
  ) {
    return { createdTrades: 0 };
  }

  const principal = Number(user.botPrincipal);
  const startFrom =
    user.lastProfitDistribution ?? new Date(user.botPurchasedAt.getTime());
  let lastDistribution = startFrom;
  let createdTrades = 0;

  while (lastDistribution.getTime() + CYCLE_DURATION_MS <= now.getTime()) {
    const tradeWindowStart = lastDistribution;
    const tradeWindowEnd = new Date(
      tradeWindowStart.getTime() + CYCLE_DURATION_MS
    );

    const cycleProfit = Number(estimateCycleProfit(principal).toFixed(4));
    if (cycleProfit <= 0) {
      break;
    }

    const okxPrice = 1 + Math.random() * 0.02;
    const binancePrice = 1 + Math.random() * 0.02;
    const spread = Math.abs(okxPrice - binancePrice);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const trade = await tx.botTrade.create({
        data: {
          userId: user.id,
          profitAmount: cycleProfit,
          tradeWindowStart,
          tradeWindowEnd,
          baseBalance: principal,
          executionLatency: Math.floor(Math.random() * 35) + 5,
          strategySnapshot: createStrategySnapshot({
            okxPrice: Number(okxPrice.toFixed(4)),
            binancePrice: Number(binancePrice.toFixed(4)),
            spread: Number(spread.toFixed(4)),
          }),
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { increment: cycleProfit },
          totalEarnings: { increment: cycleProfit },
          lastProfitDistribution: tradeWindowEnd,
        },
      });

      if (user.referredById) {
        const referralAmount = Number((cycleProfit * 0.2).toFixed(4));
        if (referralAmount > 0) {
          await recordReferralProfitShare({
            referrerId: user.referredById,
            referredUserId: user.id,
            amount: referralAmount,
            tradeId: trade.id,
            tx,
          });
        }
      }
    });

    createdTrades += 1;
    lastDistribution = tradeWindowEnd;
  }

  return { createdTrades };
}

export async function syncTradesForActiveUsers(now = new Date()) {
  const activeUsers = await prisma.user.findMany({
    where: {
      botActive: true,
      botPrincipal: { gt: 0 },
    },
    select: { id: true },
  });

  let totalTrades = 0;
  for (const user of activeUsers) {
    const { createdTrades } = await syncBotTradesForUser(user.id, now);
    totalTrades += createdTrades;
  }

  return {
    processedUsers: activeUsers.length,
    totalTrades,
  };
}
