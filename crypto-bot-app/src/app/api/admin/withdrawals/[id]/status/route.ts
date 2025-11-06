import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const statusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PAID"]),
  note: z.string().max(240).optional(),
});

export async function POST(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const { status, note } = statusSchema.parse(payload);
  const { id } = await context.params;

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!withdrawal) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (withdrawal.status === status) {
    return NextResponse.json({ success: true });
  }

  const amountDecimal = new Prisma.Decimal(withdrawal.amount);

  await prisma.$transaction(async (tx) => {
    await tx.withdrawal.update({
      where: { id: withdrawal.id },
      data: {
        status,
        note,
        processedById: session.user.id,
        processedAt: status === "PAID" || status === "REJECTED" ? new Date() : withdrawal.processedAt,
      },
    });

    if (status === "REJECTED") {
      await tx.user.update({
        where: { id: withdrawal.userId },
        data: {
          balance: { increment: amountDecimal },
          availableBalance: { increment: amountDecimal },
          totalWithdrawn: { decrement: amountDecimal },
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}
