import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

import { REFERRAL_DEPOSIT_BONUS_RATE } from "@/lib/constants";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";
import { applyReferralDepositReward } from "@/server/services/referrals";

const depositSchema = z.object({
  amount: z.coerce.number().positive(),
  txHash: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = depositSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { amount, txHash, note } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      referredById: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const autoApprove =
    process.env.AUTO_APPROVE_DEPOSITS?.toLowerCase() === "true";

  const transaction = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.walletTransaction.create({
      data: {
        userId: user.id,
        amount,
        type: "DEPOSIT",
        status: autoApprove ? "COMPLETED" : "PENDING",
        txHash,
        note,
      },
    });

    if (autoApprove) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          walletBalance: { increment: amount },
          botPrincipal: { increment: amount },
          totalDeposited: { increment: amount },
        },
      });

      if (user.referredById) {
        const referralBonus = Number(
          (amount * REFERRAL_DEPOSIT_BONUS_RATE).toFixed(4)
        );
        if (referralBonus > 0) {
          await applyReferralDepositReward({
            referrerId: user.referredById,
            referredUserId: user.id,
            amount: referralBonus,
            transactionId: created.id,
            tx,
          });
        }
      }
    }

    return created;
  });

  return NextResponse.json({
    success: true,
    transaction,
    autoApproved: autoApprove,
  });
}
