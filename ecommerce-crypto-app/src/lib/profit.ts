import {ProfitType, RewardType} from "@prisma/client";

import {prisma} from "@/lib/prisma";

const PROFIT_TABLE = [
  {balance: 20, dailyProfit: 3},
  {balance: 99, dailyProfit: 16.83},
  {balance: 458, dailyProfit: 91.6},
  {balance: 1288, dailyProfit: 283.36},
  {balance: 4388, dailyProfit: 1097},
  {balance: 10888, dailyProfit: 3048.64},
  {balance: 25888, dailyProfit: 8284.16},
];

const CYCLE_DURATION_MS = 2 * 60 * 60 * 1000;

export function estimateDailyProfit(balance: number) {
  if (balance <= 0) {
    return 0;
  }

  const sorted = [...PROFIT_TABLE].sort((a, b) => a.balance - b.balance);

  if (balance <= sorted[0]!.balance) {
    const ratio = sorted[0]!.dailyProfit / sorted[0]!.balance;
    return balance * ratio;
  }

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i]!;
    const next = sorted[i + 1]!;

    if (balance >= current.balance && balance <= next.balance) {
      const span = next.balance - current.balance;
      const progress = (balance - current.balance) / span;
      return current.dailyProfit + progress * (next.dailyProfit - current.dailyProfit);
    }
  }

  const last = sorted[sorted.length - 1]!;
  const ratio = last.dailyProfit / last.balance;
  return balance * ratio;
}

export function getCycleProfit(balance: number) {
  const daily = estimateDailyProfit(balance);
  return daily / 12;
}

export function calculateElapsedCycles(lastTimestamp: Date, now: Date) {
  const elapsed = now.getTime() - lastTimestamp.getTime();
  return Math.floor(elapsed / CYCLE_DURATION_MS);
}

export function getNextCycleEta(lastTimestamp: Date) {
  const now = Date.now();
  const last = lastTimestamp.getTime();
  const cycles = Math.ceil((now - last) / CYCLE_DURATION_MS);
  const next = last + cycles * CYCLE_DURATION_MS;
  return Math.max(next - now, 0);
}

export async function processBotCyclesForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      id: true,
      balance: true,
      botActive: true,
      botPurchasedAt: true,
      lastProfitAt: true,
      referredById: true,
    },
  });

  if (!user || !user.botActive || !user.botPurchasedAt) {
    return;
  }

  const lastProcessedAt = user.lastProfitAt ?? user.botPurchasedAt;
  const now = new Date();
  const cycles = calculateElapsedCycles(lastProcessedAt, now);

  if (cycles <= 0) {
    return;
  }

  const balanceNumber = Number(user.balance);
  const cycleProfit = getCycleProfit(balanceNumber);
  if (cycleProfit <= 0) {
    await prisma.user.update({
      where: {id: user.id},
      data: {
        lastProfitAt: new Date(lastProcessedAt.getTime() + cycles * CYCLE_DURATION_MS),
      },
    });
    return;
  }

  const roundedCycleProfit = parseFloat(cycleProfit.toFixed(2));
  const totalProfit = parseFloat((roundedCycleProfit * cycles).toFixed(2));

  const profitEntriesData = Array.from({length: cycles}).map((_, index) => {
    const cycleStart = new Date(lastProcessedAt.getTime() + index * CYCLE_DURATION_MS);
    const cycleEnd = new Date(cycleStart.getTime() + CYCLE_DURATION_MS);
    return {
      userId: user.id,
      amount: roundedCycleProfit,
      type: ProfitType.BOT,
      cycleStart,
      cycleEnd,
      createdAt: cycleEnd,
    };
  });

  await prisma.$transaction(async (tx) => {
    await tx.profitEntry.createMany({
      data: profitEntriesData,
    });

    await tx.user.update({
      where: {id: user.id},
      data: {
        balance: {
          increment: totalProfit,
        },
        lastProfitAt: new Date(lastProcessedAt.getTime() + cycles * CYCLE_DURATION_MS),
      },
    });

    if (user.referredById && totalProfit > 0) {
      const referralAmount = parseFloat((totalProfit * 0.2).toFixed(2));

      if (referralAmount > 0) {
        await tx.referralReward.create({
          data: {
            userId: user.referredById,
            fromUserId: user.id,
            amount: referralAmount,
            rewardType: RewardType.PROFIT_SHARE,
          },
        });

        await tx.user.update({
          where: {id: user.referredById},
          data: {
            balance: {
              increment: referralAmount,
            },
          },
        });

        await tx.profitEntry.create({
          data: {
            userId: user.referredById,
            amount: referralAmount,
            type: ProfitType.REFERRAL,
            cycleStart: now,
            cycleEnd: now,
          },
        });
      }
    }
  });
}

export function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export const profitReferenceTable = PROFIT_TABLE;
