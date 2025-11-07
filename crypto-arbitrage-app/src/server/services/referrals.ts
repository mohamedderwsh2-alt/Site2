import type { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/server/db";
import { generateReferralCode } from "@/lib/utils";

export async function generateUniqueReferralCode() {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateReferralCode();
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!existing) {
      return code;
    }
    attempts += 1;
  }
  throw new Error("Unable to generate unique referral code");
}

export async function recordReferralProfitShare({
  referrerId,
  referredUserId,
  amount,
  tradeId,
  tx,
}: {
  referrerId: string;
  referredUserId: string;
  amount: number;
  tradeId: string;
  tx: Prisma.TransactionClient;
}) {
  await tx.referralReward.create({
    data: {
      referrerId,
      referredUserId,
      rewardType: "PROFIT_SHARE",
      amount,
      sourceTradeId: tradeId,
    },
  });
  await tx.user.update({
    where: { id: referrerId },
    data: {
      walletBalance: { increment: amount },
      totalReferralEarnings: { increment: amount },
    },
  });
}

export async function applyReferralDepositReward({
  referrerId,
  referredUserId,
  amount,
  transactionId,
  tx,
}: {
  referrerId: string;
  referredUserId: string;
  amount: number;
  transactionId: string;
  tx: Prisma.TransactionClient;
}) {
  await tx.referralReward.create({
    data: {
      referrerId,
      referredUserId,
      rewardType: "DEPOSIT_BONUS",
      amount,
      sourceTransactionId: transactionId,
    },
  });
  await tx.user.update({
    where: { id: referrerId },
    data: {
      walletBalance: { increment: amount },
      totalReferralEarnings: { increment: amount },
    },
  });
}
