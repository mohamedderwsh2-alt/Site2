import { IconArrowRight, IconChartArcs, IconTrendingUp } from "@tabler/icons-react";
import dayjs from "dayjs";
import { demoTrades } from "@/lib/demo-data";

export default function TradesPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="glass-panel rounded-[28px] px-6 py-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Live arbitrage log
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-white">Binance ↔ OKX trade timeline</h1>
            <p className="mt-2 text-sm text-white/65">
              Each cycle uses only 10% of your balance while capturing spreads above the 3% threshold with latency under 50ms.
            </p>
          </div>
          <span className="hidden rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 md:inline-flex md:items-center md:gap-2">
            <IconChartArcs size={16} /> Cycle data refreshed every 120 minutes
          </span>
        </div>
      </header>

      <section className="glass-panel rounded-[28px] px-4 py-4 sm:px-6">
        <div className="hidden grid-cols-6 gap-4 border-b border-white/10 pb-3 text-xs uppercase tracking-[0.16em] text-white/50 sm:grid">
          <span>Trade</span>
          <span>Time</span>
          <span>Spread</span>
          <span>Volume</span>
          <span>Payout</span>
          <span>Route</span>
        </div>
        <div className="divide-y divide-white/10">
          {demoTrades.map((trade) => (
            <article
              key={trade.id}
              className="grid gap-4 py-4 text-sm text-white/80 sm:grid-cols-6 sm:items-center"
            >
              <span className="font-semibold text-white sm:text-base">{trade.id}</span>
              <span>{dayjs(trade.timestamp).format("HH:mm • DD MMM")}</span>
              <span className="flex items-center gap-2 text-[#7852ff]">
                <IconTrendingUp size={16} /> {trade.spread.toFixed(1)}%
              </span>
              <span>{trade.volume.toFixed(2)} USDT</span>
              <span className="font-semibold text-[#43c984]">
                +{trade.profit.toFixed(2)}
              </span>
              <span className="flex items-center gap-2 text-white/70">
                {trade.exchanges}
                <IconArrowRight size={16} className="hidden sm:inline" />
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-[28px] px-6 py-6">
        <h2 className="text-lg font-semibold text-white">How the spread engine works</h2>
        <ol className="mt-4 space-y-4 text-sm text-white/70">
          <li>
            <strong className="text-white">1. Market scan</strong> – Every two hours the bot polls Binance and OKX order books and calculates delta exposures.
          </li>
          <li>
            <strong className="text-white">2. Opportunity lock</strong> – Once the price difference exceeds 3%, it allocates 10% of each user balance to hedge the position.
          </li>
          <li>
            <strong className="text-white">3. Execution</strong> – Trades are executed in under 50ms using pre-funded wallets and direct API access.
          </li>
          <li>
            <strong className="text-white">4. Settlement</strong> – Net profit is distributed instantly to all active users, while referrers receive their 20% share automatically.
          </li>
        </ol>
      </section>
    </div>
  );
}
