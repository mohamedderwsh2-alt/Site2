"use server";

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

const depositSchema = z.object({
  amount: z.number().positive(),
  reference: z.string().max(160).optional(),
});

export async function createDepositRequest(
  locale: Locale,
  payload: z.infer<typeof depositSchema>,
): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return {ok: false, error: "UNAUTHENTICATED"};
  }

  const parsed = depositSchema.safeParse(payload);
  if (!parsed.success) {
    return {ok: false, error: "INVALID_INPUT"};
  }

  const {amount, reference} = parsed.data;

  await prisma.deposit.create({
    data: {
      userId: session.user.id,
      amount,
      reference,
      status: "PENDING",
    },
  });

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/dashboard/deposit`);

  return {ok: true};
}
