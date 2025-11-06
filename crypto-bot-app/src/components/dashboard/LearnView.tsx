"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Library, PlayCircle, TrendingUp } from "lucide-react";
import type { OverviewData } from "@/lib/services/overview";
import { formatUSDT } from "@/lib/utils";
import { useTranslation } from "@/i18n/TranslationProvider";

interface LearnViewProps {
  data: OverviewData;
}

export const LearnView = ({ data }: LearnViewProps) => {
  const { dictionary } = useTranslation();
  const [activeArticle, setActiveArticle] = useState<string | null>(dictionary.learn.articles[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              {dictionary.learn.title}
            </p>
            <p className="mt-2 text-sm text-slate-200/80">{dictionary.learn.subtitle}</p>
          </div>
          <PlayCircle className="h-6 w-6 text-indigo-200" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-indigo-100">
          <p className="text-[11px] uppercase tracking-widest text-indigo-200/70">
            Profit tiers
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {data.trading.profitTable.map((tier) => (
              <div key={tier.balance} className="rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-[11px] text-slate-200">
                <p className="uppercase tracking-widest text-indigo-200/70">{formatUSDT(tier.balance)}</p>
                <p className="mt-1 text-sm font-semibold text-emerald-200">
                  {formatUSDT(tier.dailyProfit)} / day
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <TrendingUp className="h-4 w-4 text-indigo-200" />
          {dictionary.trade.strategy.title}
        </h3>
        <div className="space-y-2">
          {dictionary.trade.strategy.points.map((point) => (
            <div key={point} className="rounded-2xl border border-white/5 bg-black/20 px-3 py-2 text-[11px] text-slate-200">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-200">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Library className="h-4 w-4 text-indigo-200" /> Academy articles
        </h3>
        <div className="space-y-3">
          {dictionary.learn.articles.map((article) => {
            const isActive = activeArticle === article.id;
            return (
              <motion.div
                key={article.id}
                layout
                className={`rounded-2xl border border-white/10 bg-black/20 px-3 py-3 ${
                  isActive ? "shadow-lg shadow-indigo-500/10" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveArticle(isActive ? null : article.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{article.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{article.excerpt}</p>
                  </div>
                  <motion.span
                    animate={{ rotate: isActive ? 90 : 0 }}
                    className="text-indigo-200"
                  >
                    ▸
                  </motion.span>
                </button>
                {isActive && (
                  <motion.p
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs leading-relaxed text-slate-200"
                  >
                    {article.content}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LearnView;
