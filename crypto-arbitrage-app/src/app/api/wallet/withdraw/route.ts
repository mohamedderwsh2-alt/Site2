import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { compare } from "bcryptjs";
import type { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

import { WITHDRAWAL_MIN_AMOUNT } from "@/lib/constants";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";

const withdrawSchema = z.object({
  amount: z.coerce.number().positive(),
  address: z.string().min(8).max(128),
  password: z.string().min(8),
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
  const parsed = withdrawSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { amount, address, password, note } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      walletBalance: true,
      botPrincipal: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const isValidPassword = await compare(password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json(
      { success: false, message: "Incorrect password" },
      { status: 403 }
    );
  }

  if (amount > Number(user.walletBalance)) {
    return NextResponse.json(
      { success: false, message: "Withdrawal exceeds wallet balance" },
      { status: 422 }
    );
  }

  if (amount < WITHDRAWAL_MIN_AMOUNT) {
    return NextResponse.json(
      {
        success: false,
        message: `Minimum withdrawal amount is ${WITHDRAWAL_MIN_AMOUNT} USDT.`,
      },
      { status: 422 }
    );
  }

  const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const transaction = await tx.walletTransaction.create({
      data: {
        userId: user.id,
        amount,
        type: "WITHDRAWAL",
        status: "PROCESSING",
        targetAddress: address,
        note,
      },
    });

    await tx.user.update({
      where: { id: user.id },
      data: {
        walletBalance: { decrement: amount },
        botPrincipal: {
          decrement: Math.min(Number(user.botPrincipal), amount),
        },
        totalWithdrawn: { increment: amount },
      },
    });

    return transaction;
  });

  return NextResponse.json({
    success: true,
    transaction: updated,
  });
}
