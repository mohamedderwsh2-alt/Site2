"use client";

import Link from "next/link";
import { format } from "date-fns";
import { enUS, tr as trLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Globe2, Shield } from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import type { OverviewData } from "@/lib/services/overview";
import { formatUSDT } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n/TranslationProvider";

interface ProfileViewProps {
  data: OverviewData;
}

export const ProfileView = ({ data }: ProfileViewProps) => {
  const { dictionary, locale } = useTranslation();
  const dateLocale = locale === "tr" ? trLocale : enUS;

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              {dictionary.profile.title}
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {data.user.name ?? "—"}
            </h2>
            <p className="text-sm text-slate-300/80">{data.user.email}</p>
          </div>
          <LanguageSwitcher className="bg-white/5" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-[11px] text-slate-200">
          <p className="uppercase tracking-[0.3em] text-indigo-200/80">
            Referral code
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-base font-semibold tracking-[0.35em] text-indigo-100">
              {data.user.referralCode}
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(data.user.referralCode)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-indigo-100 transition hover:bg-indigo-500/20"
            >
              <Copy className="h-3.5 w-3.5" />
              {dictionary.referral.copyCode}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            {format(new Date(data.user.createdAt), "dd MMMM yyyy", { locale: dateLocale })}
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="text-sm font-semibold text-slate-100">
          {dictionary.profile.systemStatus}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.home.performanceHighlights.profit}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {formatUSDT(data.user.totalProfit)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.home.performanceHighlights.deposited}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {formatUSDT(data.user.totalDeposited)}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.profile.activeUsers}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {data.referrals.stats.total + 1}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-black/20 px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
              {dictionary.home.balanceCard.available}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              {formatUSDT(data.user.availableBalance)}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-200" id="referral">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.referral.title}
          </h3>
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-indigo-200/70">
            <Globe2 className="h-3.5 w-3.5" />
            {dictionary.language.label}
          </span>
        </div>
        <p className="text-xs text-slate-300/80">
          {dictionary.referral.description}
        </p>
        <Link
          href={`https://t.me/share/url?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${data.user.referralCode}`)}&text=${encodeURIComponent(dictionary.home.referralBanner.body)}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400"
        >
          <ExternalLink className="h-4 w-4" /> {dictionary.home.referralBanner.button}
        </Link>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Shield className="h-4 w-4 text-emerald-200" /> {dictionary.profile.telegramTitle}
        </h3>
        <p className="text-xs text-slate-300/80">{dictionary.profile.telegramDescription}</p>
        <Link
          href={APP_CONFIG.supportTelegram}
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
        >
          <ExternalLink className="h-4 w-4" />
          {dictionary.support.button}
        </Link>
      </section>
    </div>
  );
};

export default ProfileView;
