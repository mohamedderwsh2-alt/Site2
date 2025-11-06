"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { enUS, tr as trLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import { Activity, Clock, GaugeCircle, Zap } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationProvider";
import type { OverviewData } from "@/lib/services/overview";
import { formatUSDT } from "@/lib/utils";

interface TradeViewProps {
  data: OverviewData;
}

const sampleLatency = [38, 42, 47, 33, 29, 35];

export const TradeView = ({ data }: TradeViewProps) => {
  const { dictionary, locale } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const dateLocale = locale === "tr" ? trLocale : enUS;

  const nextCycleAt = useMemo(() => new Date(data.trading.nextCycleAt), [data.trading.nextCycleAt]);

  useEffect(() => {
    const calculateProgress = () => {
      const now = Date.now();
      const next = nextCycleAt.getTime();
      const previous = next - 1000 * 60 * 60 * 2;
      const ratio = (now - previous) / (next - previous);
      setProgress(Math.min(Math.max(ratio * 100, 0), 100));
      setCurrentTime(now);
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 60000);
    return () => clearInterval(timer);
  }, [nextCycleAt]);

  const tradesToday = useMemo(() => {
    const cutoff = currentTime - 1000 * 60 * 60 * 24;
    return data.trading.recentTrades.filter((trade) => {
      const executed = new Date(trade.executedAt).getTime();
      return executed >= cutoff;
    });
  }, [currentTime, data.trading.recentTrades]);

  const averageProfit = tradesToday.reduce((sum, trade) => sum + trade.profit, 0) / Math.max(tradesToday.length, 1);

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              {dictionary.trade.cycleCard.title}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {formatUSDT(averageProfit * 12)} / {dictionary.home.balanceCard.dailyProjection}
            </h2>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-indigo-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-indigo-100">
            <Clock className="h-3 w-3" />
            {format(nextCycleAt, "HH:mm", { locale: dateLocale })}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-300">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
            <p className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.trade.cycleCard.tradesToday}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">{tradesToday.length}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
            <p className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.trade.cycleCard.avgSpread}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">3.42%</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
            <p className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.trade.cycleCard.fastest}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-50">
              {Math.min(...sampleLatency)}ms
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-indigo-200/70">
            <span>{dictionary.trade.cycleCard.cycleProgress}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-black/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-2 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.trade.title}
          </h3>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em]">
            Live
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[11px] uppercase tracking-widest text-indigo-200/70">
          <span>{dictionary.trade.spreadTable.pair}</span>
          <span>{dictionary.trade.spreadTable.okx}</span>
          <span>{dictionary.trade.spreadTable.binance}</span>
          <span>{dictionary.trade.spreadTable.spread}</span>
        </div>
        <div className="space-y-2">
          {dictionary.trade.sampleSpreads.map((row) => (
            <div
              key={row.pair}
              className="grid grid-cols-4 gap-2 rounded-2xl border border-white/5 bg-black/20 px-3 py-2 text-[11px] text-slate-100"
            >
              <span className="font-semibold">{row.pair}</span>
              <span>{row.okx}</span>
              <span>{row.binance}</span>
              <span className="text-emerald-300">{row.spread}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="text-sm font-semibold text-slate-100">
          {dictionary.trade.strategy.title}
        </h3>
        <div className="space-y-2">
          {dictionary.trade.strategy.points.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/20 px-3 py-2"
            >
              <Zap className="mt-1 h-3.5 w-3.5 text-indigo-200" />
              <p className="text-[11px] leading-relaxed text-slate-200">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="text-sm font-semibold text-slate-100">
          Recent executions
        </h3>
        {data.trading.recentTrades.length === 0 && (
          <p className="text-slate-400">{dictionary.common.empty.transactions}</p>
        )}
        <div className="space-y-2">
          {data.trading.recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-3 py-2"
            >
              <div className="flex items-center gap-3 text-[11px] text-indigo-200/80">
                <GaugeCircle className="h-4 w-4 text-indigo-200" />
                <div>
                  <p className="font-semibold text-slate-100">Cycle #{trade.cycleIndex}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    {format(new Date(trade.executedAt), "dd MMM HH:mm", { locale: dateLocale })}
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-100">
                <p className="font-semibold text-emerald-200">{formatUSDT(trade.profit)}</p>
                <p className="text-[10px] text-slate-400">{formatUSDT(trade.tradeAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Activity className="h-4 w-4 text-indigo-200" /> Bot heartbeat
        </h3>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-indigo-200/80">
          <span>Latency (ms)</span>
          <span>Target &lt; 50ms</span>
        </div>
        <div className="flex items-center gap-2">
          {sampleLatency.map((value, index) => (
            <motion.div
              key={index}
              initial={{ height: 8 }}
              animate={{ height: 8 + value / 2 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`flex-1 rounded-full ${value < 50 ? "bg-emerald-400/80" : "bg-amber-400/80"}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default TradeView;
