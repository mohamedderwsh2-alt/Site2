"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function SpreadWidget() {
  const [spread, setSpread] = useState(2.8);
  const [prices, setPrices] = useState({
    okx: 1.002,
    binance: 0.998,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const basePrice = 1 + Math.random() * 0.02;
      const diff = (Math.random() * 0.05 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
      const okx = basePrice + diff / 2;
      const binance = basePrice - diff / 2;
      setPrices({
        okx: Number(okx.toFixed(4)),
        binance: Number(binance.toFixed(4)),
      });
      setSpread(Number(Math.abs(diff).toFixed(2)) * 100);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-[24px] border border-white/10 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-indigo-500/15 p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-200">
            Live spread monitor
          </p>
          <p className="mt-1 text-3xl font-semibold">{spread.toFixed(2)}%</p>
        </div>
        <Badge variant="outline" className="gap-1 text-slate-200">
          <ArrowUpRight className="h-3 w-3" />
          Binance vs OKX
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-300">OKX</p>
          <p className="mt-1 font-semibold text-white">{prices.okx.toFixed(4)}</p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Binance
          </p>
          <p className="mt-1 font-semibold text-white">
            {prices.binance.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
