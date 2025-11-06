import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { REFERRAL_DEPOSIT_BONUS } from "@/lib/profit";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const deposit = await prisma.deposit.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          referredById: true,
        },
      },
    },
  });

  if (!deposit) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (deposit.status !== "PENDING") {
    return NextResponse.json({ error: "already_processed" }, { status: 400 });
  }

  const amountNumber = Number(deposit.amount);
  const amountDecimal = new Prisma.Decimal(amountNumber);

  await prisma.$transaction(async (tx) => {
    await tx.deposit.update({
      where: { id: deposit.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: new Date(),
        confirmedById: session.user.id,
      },
    });

    await tx.user.update({
      where: { id: deposit.userId },
      data: {
        balance: { increment: amountDecimal },
        availableBalance: { increment: amountDecimal },
        totalDeposited: { increment: amountDecimal },
      },
    });

    if (deposit.user.referredById) {
      const referralAmount = new Prisma.Decimal(
        Math.round(amountNumber * REFERRAL_DEPOSIT_BONUS * 100) / 100,
      );

      if (referralAmount.greaterThan(0)) {
        await tx.referralCommission.create({
          data: {
            earnerId: deposit.user.referredById,
            sourceUserId: deposit.userId,
            type: "DEPOSIT_BONUS",
            amount: referralAmount,
          },
        });

        await tx.user.update({
          where: { id: deposit.user.referredById },
          data: {
            balance: { increment: referralAmount },
            availableBalance: { increment: referralAmount },
            referralEarnings: { increment: referralAmount },
            totalProfit: { increment: referralAmount },
          },
        });
      }
    }
  });

  return NextResponse.json({ success: true });
}
