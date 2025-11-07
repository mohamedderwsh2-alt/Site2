import {format} from "date-fns";
import {getTranslations} from "next-intl/server";
import {notFound, redirect} from "next/navigation";

import {ActivateBotButton} from "@/app/[locale]/dashboard/_components/activate-bot-button";
import {DemoTopUpButton} from "@/app/[locale]/dashboard/_components/demo-topup-button";
import {ReferralCodeCard} from "@/app/[locale]/dashboard/_components/referral-code-card";
import {Link, pathnames} from "@/i18n/routing";
import {getServerAuthSession} from "@/lib/auth";
import {fetchDashboardData} from "@/lib/user";
import {Locale, defaultLocale, locales} from "@/util/i18n";
import {cn} from "@/util/cn";

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function formatAmount(value: number, locale: Locale) {
  return value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default async function DashboardPage({params}: DashboardPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const dashboardData = await fetchDashboardData(session.user.id);
  if (!dashboardData) {
    notFound();
  }

    const {user, stats, history} = dashboardData;

    const [tOverview, tWallet, tReferral, tCommon] = await Promise.all([
      getTranslations("dashboard.overview"),
      getTranslations("wallet"),
      getTranslations("referral"),
      getTranslations("common"),
    ]);

    const profitRows = history.profits.slice(0, 6);
    type AppRoute = keyof typeof pathnames;

    const pendingLinks: Array<{label: string; count: number; href: AppRoute}> = [
      {
        label: tOverview("deposits"),
        count: stats.pendingDeposits,
        href: "/dashboard/deposit",
      },
      {
        label: tOverview("withdrawals"),
        count: stats.pendingWithdrawals,
        href: "/dashboard/withdraw",
      },
    ];

  return (
    <div className="space-y-8 pb-16">
      <section className="space-y-6">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tOverview("balanceTitle")}</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">
                {formatAmount(user.balance, normalizedLocale)} <span className="text-base text-slate-200/60">USDT</span>
              </h2>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-slate-200/80">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tOverview("botStatus")}</p>
              <p className="mt-2 font-semibold text-white">
                {user.botActive ? tOverview("botActive") : tOverview("botInactive")}
              </p>
              {stats.nextCycle ? (
                <p className="text-xs text-slate-200/60">
                  {tOverview("nextCycle")}: <span className="font-mono text-sky-200">{stats.nextCycle}</span>
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/60">{tOverview("todayProfit")}</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                +{formatAmount(stats.todayProfit, normalizedLocale)} <span className="text-xs text-slate-200/60">USDT</span>
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/60">{tOverview("todayReferral")}</p>
              <p className="mt-2 text-2xl font-semibold text-fuchsia-200">
                +{formatAmount(stats.todayReferralProfit, normalizedLocale)}{" "}
                <span className="text-xs text-slate-200/60">USDT</span>
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/30 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tReferral("stats.teamSize")}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.referralTeamSize}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {user.botActive ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{tReferral("title")}</h3>
                <p className="text-sm text-slate-200/70">{tReferral("headline")}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {pendingLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-3xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-slate-200/80 transition hover:border-white/20"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{item.count}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{tOverview("botInactive")}</h3>
                <p className="text-sm text-slate-200/70">{tOverview("activationNote")}</p>
                <ActivateBotButton locale={normalizedLocale} disabled={user.balance < 5} />
              </div>
            )}
          </div>
          <div className="rounded-4xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-200/70 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tCommon("demoOnly")}</p>
            <p className="mt-2 text-lg font-semibold text-white">{tWallet("depositTitle")}</p>
            <p className="mt-3 text-sm">{tWallet("depositNote")}</p>
            <div className="mt-4">
              <DemoTopUpButton locale={normalizedLocale} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{tOverview("recentCycles")}</h3>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{history.profits.length} / 12</span>
          </div>
          <div className="mt-4 space-y-3">
            {profitRows.length === 0 ? (
              <p className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200/60">
                {tOverview("emptyProfits")}
              </p>
            ) : (
              profitRows.map((profit) => (
                <div
                  key={profit.id}
                  className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80"
                >
                  <div>
                    <p className="font-medium text-white">
                      +{formatAmount(profit.amount, normalizedLocale)} <span className="text-xs">USDT</span>
                    </p>
                    <p className="text-xs text-slate-200/50">{format(new Date(profit.cycleEnd), "MMM d · HH:mm")}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em]",
                      profit.type === "BOT"
                        ? "border-emerald-400/50 text-emerald-200/90"
                        : "border-fuchsia-400/40 text-fuchsia-200/90",
                    )}
                  >
                    {profit.type === "BOT" ? "BOT" : "REF"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ReferralCodeCard code={user.referralCode} />
          <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tOverview("referralSummary.title")}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-200/80">
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
                <span>{tOverview("referralSummary.teamMembers")}</span>
                <span className="font-semibold text-white">{stats.referralTeamSize}</span>
              </div>
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3">
                <span>{tOverview("referralSummary.today")}</span>
                <span className="font-semibold text-white">
                  +{formatAmount(stats.todayReferralProfit, normalizedLocale)} USDT
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              <Link
                href="/dashboard/deposit"
                className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-center text-slate-200/80 transition hover:border-white/30 hover:text-white"
              >
                {tOverview("quickLinks.deposit")}
              </Link>
              <Link
                href="/dashboard/withdraw"
                className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-center text-slate-200/80 transition hover:border-white/30 hover:text-white"
              >
                {tOverview("quickLinks.withdraw")}
              </Link>
              <Link
                href="/dashboard/referrals"
                className="rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-center text-slate-200/80 transition hover:border-white/30 hover:text-white"
              >
                {tOverview("quickLinks.referrals")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
