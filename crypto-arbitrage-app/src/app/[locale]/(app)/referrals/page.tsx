import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { Gift } from "lucide-react";

import { ReferralCard } from "@/components/referrals/referral-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";

export default async function ReferralsPage({
  params,
}: {
  params: { locale: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    redirect(`/${params.locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      totalReferralEarnings: true,
      referrals: {
        select: { id: true, email: true, createdAt: true },
      },
    },
  });

  if (!user?.referralCode) {
    redirect(`/${params.locale}/dashboard`);
  }

  const rewards = await prisma.referralReward.findMany({
    where: { referrerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      referredUser: {
        select: {
          email: true,
        },
      },
    },
  });

  type RewardRecord = (typeof rewards)[number];
  const shareLink = `${
    process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}`.replace(/\/$/, "")
      : ""
  }/${params.locale}/register?ref=${user.referralCode}`;
  const [referralsT, common] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "referrals" }),
    getTranslations({ locale: params.locale, namespace: "common" }),
  ]);

  return (
    <main className="flex flex-col gap-6 pb-6">
      <ReferralCard
        code={user.referralCode}
        shareLink={shareLink}
        totalPartners={user.referrals.length}
        totalEarnings={Number(user.totalReferralEarnings)}
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {referralsT("recentRewards")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-300">
            <Gift className="h-3 w-3" />
            {rewards.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {rewards.length === 0 && (
            <Card>
              <CardDescription>{common("comingSoon")}</CardDescription>
            </Card>
          )}
          {rewards.map((reward: RewardRecord) => (
            <Card key={reward.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">
                  {formatCurrency(Number(reward.amount))}
                </CardTitle>
                <span className="text-xs text-slate-300">
                  {new Date(reward.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <CardDescription className="text-xs text-slate-300">
                {reward.rewardType === "DEPOSIT_BONUS"
                  ? referralsT("depositBonus")
                  : referralsT("profitShare")}{" "}
                · {reward.referredUser?.email ?? common("anonymous")}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="glass rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
        <h2 className="text-base font-semibold text-white">
          {referralsT("title")}
        </h2>
        <p className="mt-2">
          {referralsT("commissionExplainer")}
        </p>
        <Link
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-xs font-semibold text-sky-300"
        >
          {common("viewAll")}
        </Link>
      </section>
    </main>
  );
}
