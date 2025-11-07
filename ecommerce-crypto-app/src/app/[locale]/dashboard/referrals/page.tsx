import {format} from "date-fns";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {ReferralCodeCard} from "@/app/[locale]/dashboard/_components/referral-code-card";
import {getServerAuthSession} from "@/lib/auth";
import {fetchDashboardData} from "@/lib/user";
import {Locale, defaultLocale, locales} from "@/util/i18n";

type ReferralsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ReferralsPage({params}: ReferralsPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const data = await fetchDashboardData(session.user.id);

  const [tReferral, tWallet] = await Promise.all([getTranslations("referral"), getTranslations("wallet")]);

  const rewards = data?.history.referralRewards ?? [];
  const team = data?.team ?? [];

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h1 className="text-2xl font-semibold text-white">{tReferral("headline")}</h1>
        <p className="mt-3 text-sm text-slate-200/70">{tWallet("depositNote")}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">{tReferral("historyTitle")}</h2>
          <div className="mt-4 space-y-3">
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80"
                >
                  <div>
                    <p className="font-semibold text-white">
                      +{reward.amount.toLocaleString(normalizedLocale, {minimumFractionDigits: 2})} USDT
                    </p>
                    <p className="text-xs text-slate-200/50">{format(new Date(reward.createdAt), "MMM d · HH:mm")}</p>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                    {reward.rewardType === "DEPOSIT_BONUS" ? "5% DEPOSIT" : "20% PROFIT"}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200/60">
                {tReferral("emptyHistory")}
              </p>
            )}
          </div>
        </div>
        <ReferralCodeCard code={data?.user.referralCode ?? ""} />
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-lg font-semibold text-white">{tReferral("teamTitle")}</h2>
        <div className="mt-4 space-y-3">
          {team.length > 0 ? (
            team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80"
              >
                <div>
                  <p className="font-medium text-white">{member.email}</p>
                  <p className="text-xs text-slate-200/50">{format(new Date(member.createdAt), "MMM d · HH:mm")}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tReferral("title")}</span>
              </div>
            ))
          ) : (
            <p className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200/60">
              {tReferral("emptyTeam")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
