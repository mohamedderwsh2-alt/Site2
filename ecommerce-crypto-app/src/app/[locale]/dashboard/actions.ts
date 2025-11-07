"use server";

import {revalidatePath} from "next/cache";

import {getServerAuthSession} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {Locale} from "@/util/i18n";

type ActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

const BOT_ACTIVATION_FEE = 5;
const DEMO_TOP_UP_AMOUNT = 100;

export async function activateTradingBot(locale: Locale): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return {ok: false, error: "UNAUTHENTICATED"};
  }

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    select: {
      id: true,
      balance: true,
      botActive: true,
    },
  });

  if (!user) {
    return {ok: false, error: "USER_NOT_FOUND"};
  }

  if (user.botActive) {
    return {ok: false, error: "BOT_ALREADY_ACTIVE"};
  }

  if (Number(user.balance) < BOT_ACTIVATION_FEE) {
    return {ok: false, error: "INSUFFICIENT_FUNDS"};
  }

  await prisma.user.update({
    where: {id: user.id},
    data: {
      balance: {
        decrement: BOT_ACTIVATION_FEE,
      },
      botActive: true,
      botInvestment: {
        increment: BOT_ACTIVATION_FEE,
      },
      botPurchasedAt: new Date(),
      lastProfitAt: new Date(),
    },
  });

  revalidatePath(`/${locale}/dashboard`);
  return {ok: true};
}

export async function createDemoTopUp(locale: Locale): Promise<ActionResult> {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return {ok: false, error: "UNAUTHENTICATED"};
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {id: session.user.id},
      select: {
        id: true,
        referredById: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    await tx.deposit.create({
      data: {
        userId: user.id,
        amount: DEMO_TOP_UP_AMOUNT,
        status: "COMPLETED",
        reference: "DEMO TOP-UP",
      },
    });

    await tx.user.update({
      where: {id: user.id},
      data: {
        balance: {
          increment: DEMO_TOP_UP_AMOUNT,
        },
        totalDeposited: {
          increment: DEMO_TOP_UP_AMOUNT,
        },
      },
    });

    if (user.referredById) {
      const referralBonus = parseFloat((DEMO_TOP_UP_AMOUNT * 0.05).toFixed(2));

      if (referralBonus > 0) {
        await tx.referralReward.create({
          data: {
            userId: user.referredById,
            fromUserId: user.id,
            amount: referralBonus,
            rewardType: "DEPOSIT_BONUS",
          },
        });

        await tx.user.update({
          where: {id: user.referredById},
          data: {
            balance: {
              increment: referralBonus,
            },
          },
        });
      }
    }
  });

  revalidatePath(`/${locale}/dashboard`);
  return {ok: true};
}
