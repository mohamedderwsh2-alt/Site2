import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import type { Prisma } from "@/generated/prisma/client";

import { BOT_LICENSE_COST } from "@/lib/constants";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";

export async function POST() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      botActive: true,
      walletBalance: true,
      botPrincipal: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  if (user.botActive) {
    return NextResponse.json(
      { success: false, message: "Trading bot is already active" },
      { status: 409 }
    );
  }

  if (Number(user.walletBalance) < BOT_LICENSE_COST) {
    return NextResponse.json(
      {
        success: false,
        message: `At least ${BOT_LICENSE_COST} USDT is required in the wallet to activate the bot.`,
      },
      { status: 422 }
    );
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const purchase = await tx.botPurchase.create({
      data: {
        userId: user.id,
        amount: BOT_LICENSE_COST,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    await tx.walletTransaction.create({
      data: {
        userId: user.id,
        amount: BOT_LICENSE_COST,
        type: "WITHDRAWAL",
        status: "COMPLETED",
        note: "Trading bot license purchase",
      },
    });

    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        walletBalance: { decrement: BOT_LICENSE_COST },
        botActive: true,
        botPurchasedAt: new Date(),
      },
      select: {
        walletBalance: true,
        botPrincipal: true,
        botPurchasedAt: true,
      },
    });

    return {
      purchase,
      user: updatedUser,
    };
  });

  return NextResponse.json({
    success: true,
    ...result,
  });
}
