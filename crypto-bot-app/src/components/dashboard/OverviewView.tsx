"use client";

import { useMemo } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, tr as trLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Coins,
  LineChart,
  Repeat2,
  Share2,
  Users,
  Wallet2,
} from "lucide-react";
import { calculateDailyProfit } from "@/lib/profit";
import { formatUSDT } from "@/lib/utils";
import { useTranslation } from "@/i18n/TranslationProvider";
import type { OverviewData } from "@/lib/services/overview";

interface OverviewViewProps {
  data: OverviewData;
}

const FadeCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-inner"
  >
    {children}
  </motion.div>
);

export const OverviewView = ({ data }: OverviewViewProps) => {
  const { dictionary, locale } = useTranslation();
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/register?ref=${data.user.referralCode}`;
  }, [data.user.referralCode]);

  const dateLocale = locale === "tr" ? trLocale : enUS;

  const nextCycleAt = useMemo(() => new Date(data.trading.nextCycleAt), [data.trading.nextCycleAt]);
  const timeUntilNext = formatDistanceToNow(nextCycleAt, {
    addSuffix: true,
    locale: dateLocale,
  });

  const dailyProfit = calculateDailyProfit(data.user.balance);
  const cycleProfit = dailyProfit / 12;

  const highlights = [
    {
      label: dictionary.home.performanceHighlights.deposited,
      value: formatUSDT(data.user.totalDeposited),
      icon: Wallet2,
    },
    {
      label: dictionary.home.performanceHighlights.profit,
      value: formatUSDT(data.user.totalProfit),
      icon: ArrowUpRight,
    },
    {
      label: dictionary.home.performanceHighlights.referral,
      value: formatUSDT(data.user.referralEarnings),
      icon: Share2,
    },
    {
      label: dictionary.home.performanceHighlights.withdraw,
      value: formatUSDT(data.user.totalWithdrawn),
      icon: Coins,
    },
  ];

  const quickActions = [
    {
      label: dictionary.home.quickActions.deposit,
      href: "/app/wallet#deposit",
      icon: Wallet2,
    },
    {
      label: dictionary.home.quickActions.withdraw,
      href: "/app/wallet#withdraw",
      icon: Repeat2,
    },
    {
      label: dictionary.home.quickActions.refer,
      href: "/app/profile#referral",
      icon: Share2,
    },
    {
      label: dictionary.home.quickActions.learn,
      href: "/app/learn",
      icon: LineChart,
    },
  ];

  return (
    <div className="space-y-6">
      <FadeCard>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
              {dictionary.home.balanceCard.title}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-50">
              {formatUSDT(data.user.balance)}
            </h2>
          </div>
          <div className="text-right text-xs text-indigo-200">
            <p>{dictionary.home.balanceCard.nextCycle}</p>
            <p className="font-semibold text-indigo-100">{timeUntilNext}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <p className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.home.balanceCard.available}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {formatUSDT(data.user.availableBalance)}
            </p>
          </div>
          <div>
            <p className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.home.balanceCard.dailyProjection}
            </p>
            <p className="mt-1 text-sm font-semibold text-emerald-200">
              {formatUSDT(dailyProfit)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] text-slate-200">
          <span>
            {dictionary.home.profitTimeline.subtitle}
          </span>
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-indigo-100">
            +{formatUSDT(cycleProfit)} / 2h
          </span>
        </div>
      </FadeCard>

      <FadeCard>
        <h3 className="text-sm font-semibold text-slate-100">
          {dictionary.home.quickActions.title}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-indigo-100 transition hover:bg-indigo-500/20"
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </Link>
          ))}
        </div>
      </FadeCard>

      <FadeCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.home.performanceHighlights.title}
          </h3>
          <Link href="/app/wallet" className="text-xs text-indigo-200">
            {dictionary.common.actions.viewAll}
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-300">
          {highlights.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-indigo-200/70">
                  {label}
                </span>
                <Icon className="h-4 w-4 text-indigo-200" />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-50">{value}</p>
            </div>
          ))}
        </div>
      </FadeCard>

      <FadeCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.trade.title}
          </h3>
          <Link href="/app/trade" className="text-xs text-indigo-200">
            {dictionary.common.actions.learnMore}
          </Link>
        </div>
        <div className="mt-4 space-y-3 text-xs text-slate-200">
          {data.trading.recentTrades.length === 0 && (
            <p className="text-slate-400">{dictionary.common.empty.transactions}</p>
          )}
          {data.trading.recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-3 py-3"
            >
              <div>
                <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
                  Cycle #{trade.cycleIndex}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  {formatUSDT(trade.profit)}
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <p>{formatDistanceToNow(new Date(trade.executedAt), { addSuffix: true, locale: dateLocale })}</p>
                <p className="text-xs text-indigo-200/80">
                  {format(new Date(trade.executedAt), "HH:mm", { locale: dateLocale })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeCard>

      <FadeCard>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.referral.title}
          </h3>
          {shareUrl && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-widest text-indigo-100 transition hover:bg-indigo-500/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              {dictionary.referral.copyCode}
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-200">
          <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.referral.stats.invited}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{data.referrals.stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.referral.stats.active}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{data.referrals.stats.active}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.referral.stats.deposits}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {formatUSDT(data.referrals.stats.totalDeposited)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3">
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.referral.stats.profits}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {formatUSDT(data.referrals.stats.totalProfit)}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-[11px] text-slate-300">
          <p className="flex items-center gap-2 text-indigo-200">
            <Users className="h-3.5 w-3.5" /> {dictionary.referral.description}
          </p>
          <p className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-indigo-100">
            {data.user.referralCode}
          </p>
        </div>
      </FadeCard>
    </div>
  );
};

export default OverviewView;
