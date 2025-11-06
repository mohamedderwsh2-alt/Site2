import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  calculateDailyProfit,
  roundTo,
  TWO_HOURS_MS,
  PROFIT_SHARE_RATE,
  REFERRAL_DEPOSIT_BONUS,
} from "@/lib/profit";

export const runTradingCyclesForUser = async (userId: string) => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        balance: true,
        availableBalance: true,
        totalProfit: true,
        referralEarnings: true,
        lastTradeAt: true,
        tradeCyclesRun: true,
        createdAt: true,
        referredById: true,
      },
    });

    if (!user) return null;

    const balanceNumber = Number(user.balance);

    if (balanceNumber <= 0) {
      return { cyclesExecuted: 0 } as const;
    }

    const referenceDate = user.lastTradeAt ?? user.createdAt;
    const diffMs = now.getTime() - referenceDate.getTime();
    const cyclesDue = Math.floor(diffMs / TWO_HOURS_MS);

    if (cyclesDue <= 0) {
      return { cyclesExecuted: 0 } as const;
    }

    let runningBalance = balanceNumber;
    let accumulatedProfit = 0;
    const tradesData: Parameters<typeof tx.trade.createMany>[0]["data"] = [];
    const earningsData: Parameters<typeof tx.earningLog.createMany>[0]["data"] = [];
    const commissionData: Parameters<typeof tx.referralCommission.createMany>[0]["data"] = [];

    for (let i = 0; i < cyclesDue; i += 1) {
      const cycleIndex = user.tradeCyclesRun + i + 1;
      const executedAt = new Date(referenceDate.getTime() + TWO_HOURS_MS * (i + 1));

      const dailyProfit = calculateDailyProfit(runningBalance);
      const cycleProfit = roundTo(dailyProfit / 12);

      if (cycleProfit <= 0) continue;

      const tradeAmount = roundTo(runningBalance * 0.1);

      runningBalance = roundTo(runningBalance + cycleProfit);
      accumulatedProfit = roundTo(accumulatedProfit + cycleProfit);

      tradesData.push({
        id: crypto.randomUUID(),
        userId: user.id,
        cycleIndex,
        executedAt,
        tradeAmount: new Prisma.Decimal(tradeAmount),
        profit: new Prisma.Decimal(cycleProfit),
        createdAt: executedAt,
      });

      earningsData.push({
        id: crypto.randomUUID(),
        userId: user.id,
        amount: new Prisma.Decimal(cycleProfit),
        source: "TRADE",
        note: `Cycle #${cycleIndex}`,
        createdAt: executedAt,
      });

      if (user.referredById) {
        const referralShare = roundTo(cycleProfit * PROFIT_SHARE_RATE);

        if (referralShare > 0) {
          commissionData.push({
            id: crypto.randomUUID(),
            earnerId: user.referredById,
            sourceUserId: user.id,
            type: "PROFIT_SHARE",
            amount: new Prisma.Decimal(referralShare),
            createdAt: executedAt,
          });
        }
      }
    }

    if (accumulatedProfit <= 0) {
      return { cyclesExecuted: 0 } as const;
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        balance: new Prisma.Decimal(runningBalance),
        availableBalance: new Prisma.Decimal(Number(user.availableBalance) + accumulatedProfit),
        totalProfit: new Prisma.Decimal(Number(user.totalProfit) + accumulatedProfit),
        lastTradeAt: new Date(referenceDate.getTime() + TWO_HOURS_MS * cyclesDue),
        tradeCyclesRun: user.tradeCyclesRun + cyclesDue,
      },
    });

    if (tradesData.length) {
      await tx.trade.createMany({ data: tradesData });
    }

    if (earningsData.length) {
      await tx.earningLog.createMany({ data: earningsData });
    }

    if (commissionData.length) {
      await tx.referralCommission.createMany({ data: commissionData });

      const commissionMap = commissionData.reduce<Record<string, number>>((acc, item) => {
        const amount = Number(item.amount);
        acc[item.earnerId] = (acc[item.earnerId] ?? 0) + amount;
        return acc;
      }, {});

      await Promise.all(
        Object.entries(commissionMap).map(([earnerId, amount]) =>
          tx.user.update({
            where: { id: earnerId },
            data: {
              balance: {
                increment: new Prisma.Decimal(amount),
              },
              availableBalance: {
                increment: new Prisma.Decimal(amount),
              },
              referralEarnings: {
                increment: new Prisma.Decimal(amount),
              },
              totalProfit: {
                increment: new Prisma.Decimal(amount),
              },
            },
          }),
        ),
      );
    }

    return {
      cyclesExecuted: tradesData.length,
      profitGenerated: accumulatedProfit,
    } as const;
  });
};
