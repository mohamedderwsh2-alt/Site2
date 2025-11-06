import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

const depositSchema = z
  .object({
    amount: z.number().min(5, "minimum_deposit"),
    txHash: z.string().max(120).optional(),
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
    const { amount, txHash, note } = depositSchema.parse(payload);

    const deposit = await prisma.deposit.create({
      data: {
        userId: session.user.id,
        amount: new Prisma.Decimal(amount),
        txHash,
        note,
      },
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        status: deposit.status,
        amount: Number(deposit.amount),
        createdAt: deposit.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "validation_error", issues: error.flatten() }, { status: 400 });
    }

    console.error("Deposit request failed", error);
    return NextResponse.json({ error: "deposit_failed" }, { status: 500 });
  }
}
