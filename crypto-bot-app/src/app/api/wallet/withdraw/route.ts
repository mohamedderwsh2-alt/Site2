import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { compare } from "bcrypt";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const withdrawSchema = z
  .object({
    amount: z.number().min(5, "minimum_withdraw"),
    address: z.string().min(10).max(120),
    password: z.string().min(6),
    note: z.string().max(240).optional(),
  })
  .strict();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { amount, address, password, note } = withdrawSchema.parse(payload);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
        balance: true,
        availableBalance: true,
      },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const validPassword = await compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json({ error: "invalid_password" }, { status: 403 });
    }

    const available = Number(user.availableBalance);

    if (amount > available) {
      return NextResponse.json({ error: "insufficient_funds" }, { status: 400 });
    }

    const amountDecimal = new Prisma.Decimal(amount);

    const withdrawal = await prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount: amountDecimal,
          address,
          note,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: amountDecimal },
          availableBalance: { decrement: amountDecimal },
          totalWithdrawn: { increment: amountDecimal },
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        status: withdrawal.status,
        amount,
        address: withdrawal.address,
        createdAt: withdrawal.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "validation_error", issues: error.flatten() }, { status: 400 });
    }

    console.error("Withdraw request failed", error);
    return NextResponse.json({ error: "withdraw_failed" }, { status: 500 });
  }
}
