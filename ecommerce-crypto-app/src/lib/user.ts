import {ProfitType, TransactionStatus} from "@prisma/client";
import {startOfDay} from "date-fns";

import {prisma} from "@/lib/prisma";
import {formatDuration, getNextCycleEta, processBotCyclesForUser} from "@/lib/profit";

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {id: userId},
  });
}

export async function fetchDashboardData(userId: string) {
  await processBotCyclesForUser(userId);

  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: {
      profits: {
        orderBy: {cycleEnd: "desc"},
        take: 12,
      },
      deposits: {
        orderBy: {createdAt: "desc"},
        take: 5,
      },
      withdrawals: {
        orderBy: {createdAt: "desc"},
        take: 5,
      },
      referralRewards: {
        orderBy: {createdAt: "desc"},
        take: 5,
      },
      referrals: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const today = startOfDay(new Date());

  const todayProfit = user.profits
    .filter((profit) => profit.cycleEnd >= today && profit.type === ProfitType.BOT)
    .reduce((acc, profit) => acc + Number(profit.amount), 0);

  const todayReferralProfit = user.profits
    .filter((profit) => profit.cycleEnd >= today && profit.type === ProfitType.REFERRAL)
    .reduce((acc, profit) => acc + Number(profit.amount), 0);

  const pendingDeposits = user.deposits.filter((deposit) => deposit.status === TransactionStatus.PENDING).length;
  const pendingWithdrawals = user.withdrawals.filter((withdraw) => withdraw.status === TransactionStatus.PENDING).length;

  const nextCycleMs =
    user.botActive && user.lastProfitAt
      ? getNextCycleEta(user.lastProfitAt)
      : user.botActive && user.botPurchasedAt
        ? getNextCycleEta(user.botPurchasedAt)
        : null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      balance: Number(user.balance),
      botActive: user.botActive,
      botInvestment: Number(user.botInvestment),
      lastProfitAt: user.lastProfitAt?.toISOString() ?? null,
      botPurchasedAt: user.botPurchasedAt?.toISOString() ?? null,
      referralCode: user.referralCode,
      totalDeposited: Number(user.totalDeposited),
      totalWithdrawn: Number(user.totalWithdrawn),
    },
    stats: {
      todayProfit,
      todayReferralProfit,
      referralTeamSize: user.referrals.length,
      pendingDeposits,
      pendingWithdrawals,
      nextCycle: nextCycleMs ? formatDuration(nextCycleMs) : null,
    },
    history: {
      profits: user.profits.map((profit) => ({
        id: profit.id,
        amount: Number(profit.amount),
        type: profit.type,
        cycleEnd: profit.cycleEnd.toISOString(),
      })),
      deposits: user.deposits.map((deposit) => ({
        id: deposit.id,
        amount: Number(deposit.amount),
        status: deposit.status,
        createdAt: deposit.createdAt.toISOString(),
        reference: deposit.reference,
      })),
      withdrawals: user.withdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        amount: Number(withdrawal.amount),
        status: withdrawal.status,
        createdAt: withdrawal.createdAt.toISOString(),
        address: withdrawal.address,
      })),
      referralRewards: user.referralRewards.map((reward) => ({
        id: reward.id,
        amount: Number(reward.amount),
        rewardType: reward.rewardType,
        createdAt: reward.createdAt.toISOString(),
        fromUserId: reward.fromUserId,
      })),
    },
    team: user.referrals.map((ref) => ({
      id: ref.id,
      email: ref.email,
      createdAt: ref.createdAt.toISOString(),
    })),
  };
}
