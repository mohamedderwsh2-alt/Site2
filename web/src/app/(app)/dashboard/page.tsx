import {
  IconActivityHeartbeat,
  IconClockHour2,
  IconCurrencyDollar,
  IconUsersGroup,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { MetricCard } from "@/components/ui/metric-card";
import { demoUser, demoProfitSchedule } from "@/lib/demo-data";

const cycleItems = demoProfitSchedule.map((item, index) => ({
  ...item,
  cycleIndex: index + 1,
}));

export default function DashboardOverviewPage() {
  const nextCycleTime = dayjs()
    .add(demoUser.nextCycleEtaMinutes, "minute")
    .format("HH:mm");

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Vault Balance"
          value={<span>{demoUser.balance.toFixed(2)} USDT</span>}
          hint={`Cycle profit: +${demoUser.cycleProfit.toFixed(2)} USDT`}
          footer={
            <span className="flex items-center gap-2 text-xs text-white/70">
              <IconClockHour2 size={14} /> Next run at {nextCycleTime}
            </span>
          }
        />
        <MetricCard
          label="Estimated Daily Profit"
          value={<span className="text-[#43c984]">+{demoUser.dailyProfit.toFixed(2)} USDT</span>}
          hint="Based on active balance tier and 12 cycles per day."
          accent="success"
          footer={
            <span className="flex items-center gap-2 text-xs text-white/70">
              <IconActivityHeartbeat size={14} /> Strategy risk exposure capped at 10% per trade
            </span>
          }
        />
        <MetricCard
          label="Referral Network"
          value={<span>{demoUser.referralCount} active members</span>}
          hint={`Passive income: +${demoUser.referralEarnings.toFixed(2)} USDT / day`}
          accent="warning"
          footer={
            <span className="flex items-center gap-2 text-xs text-white/70">
              <IconUsersGroup size={14} /> Earning 20% of each member&apos;s cycle profits
            </span>
          }
        />
        <MetricCard
          label="Bot Licenses"
          value={<span>{demoUser.botCount} active</span>}
          hint="Each license executes the Binance ↔ OKX arbitrage playbook autonomously."
          accent="accent"
          footer={
            <span className="flex items-center gap-2 text-xs text-white/70">
              <IconCurrencyDollar size={14} /> Purchase additional bots for 5 USDT each
            </span>
          }
        />
      </section>

      <section className="glass-panel rounded-[28px] px-6 py-6">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Today&apos;s Trading Cycles</h2>
            <p className="text-sm text-white/60">
              Every entry shows the spread captured between Binance and OKX for this wallet.
            </p>
          </div>
          <span className="rounded-full border border-white/15 px-4 py-1 text-xs text-white/60">
            {cycleItems.length} / 12 cycles complete
          </span>
        </header>

        <div className="flex flex-col gap-4">
          {cycleItems.map((item) => (
            <div
              key={item.cycle}
              className="flex flex-col gap-3 rounded-[22px] bg-white/5 px-4 py-4 text-white/75 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  Cycle #{item.cycleIndex}
                </p>
                <p className="text-xs text-white/50">Window {item.cycle}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#7852ff]/20 px-3 py-1 text-xs text-[#d7c9ff]">
                  Spread &gt; 3%
                </span>
                <span className="text-sm font-semibold text-[#43c984]">
                  +{item.profit.toFixed(2)} USDT
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-[28px] px-6 py-6">
        <h2 className="text-lg font-semibold text-white">Operational Checklist</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          <li className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#43c984]/20 text-[#43c984]">
              ●
            </span>
            Binance funding wallet synchronized 12 minutes ago.
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#7852ff]/20 text-[#7852ff]">
              ●
            </span>
            OKX borrow limit ready for next cycle.
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/15 text-white/80">
              ●
            </span>
            Manual withdrawal requests awaiting approval: 1
          </li>
        </ul>
      </section>
    </div>
  );
}
