"use server";

import {compare} from "bcryptjs";
import {revalidatePath} from "next/cache";
import {z} from "zod";

import {getServerAuthSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {Locale} from "@/util/i18n";

type ActionResult =
  | {ok: true}
  | {
      ok: false;
      error: string;
    };

const withdrawSchema = z.object({
  amount: z.number().positive(),
  address: z.string().min(4).max(120),
  password: z.string().min(6),
});

export async function createWithdrawRequest(
  locale: Locale,
  input: z.infer<typeof withdrawSchema>,
): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return {ok: false, error: "UNAUTHENTICATED"};
  }

  const parsed = withdrawSchema.safeParse(input);
  if (!parsed.success) {
    return {ok: false, error: "INVALID_INPUT"};
  }

  const {amount, address, password} = parsed.data;

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    select: {
      id: true,
      passwordHash: true,
      balance: true,
    },
  });

  if (!user) {
    return {ok: false, error: "USER_NOT_FOUND"};
  }

  const passwordValid = await compare(password, user.passwordHash);
  if (!passwordValid) {
    return {ok: false, error: "INVALID_PASSWORD"};
  }

  if (Number(user.balance) < amount) {
    return {ok: false, error: "INSUFFICIENT_FUNDS"};
  }

  await prisma.$transaction(async (tx) => {
    await tx.withdrawal.create({
      data: {
        userId: user.id,
        amount,
        address,
        status: "PENDING",
      },
    });

    await tx.user.update({
      where: {id: user.id},
      data: {
        balance: {
          decrement: amount,
        },
        totalWithdrawn: {
          increment: amount,
        },
      },
    });
  });

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/withdraw`);

  return {ok: true};
}
