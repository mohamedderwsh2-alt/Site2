import Link from "next/link";
import {
  IconArrowRight,
  IconBrandTelegram,
  IconChartHistogram,
  IconShieldLock,
  IconWorld,
} from "@tabler/icons-react";

const profitTable = [
  { balance: 20, daily: 3.0 },
  { balance: 99, daily: 16.83 },
  { balance: 458, daily: 91.6 },
  { balance: 1288, daily: 283.36 },
  { balance: 4388, daily: 1097 },
  { balance: 10888, daily: 3048.64 },
  { balance: 25888, daily: 8284.16 },
];

const highlights = [
  {
    icon: IconChartHistogram,
    title: "Two-Hour Trading Rhythm",
    description:
      "Our bot monitors Binance vs OKX spreads every 120 minutes and executes latency-optimized arbitrage flows in under 50ms.",
  },
  {
    icon: IconShieldLock,
    title: "Self-Custodied Wallet",
    description:
      "Hold funds in your ArbiterX vault, track deposits, and raise manual withdrawals with password confirmation for security.",
  },
  {
    icon: IconWorld,
    title: "Localized Experience",
    description:
      "Switch languages instantly to onboard international communities with familiar terminology and guided content.",
  },
];

export default function Home() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-4 py-16 sm:px-8">
      <div className="glass-panel relative overflow-hidden rounded-[32px] px-6 py-10 sm:px-10">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(120,82,255,0.4),transparent_72%)]" />
        <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Binance ↔ OKX Arbitrage
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Trade the spread like a pro with a bot that never sleeps.
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              ArbiterX captures price differences across Binance and OKX, distributing stable 3% cycle profits while maintaining a conservative 10% capital exposure per trade.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_14px_30px_rgba(120,82,255,0.45)] transition hover:opacity-90"
              >
                Create My Bot Pass
                <IconArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                I already have an account
              </Link>
            </div>
            <div className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <IconBrandTelegram size={20} />
              <span>
                Join our Telegram operations room for live status broadcasts.
              </span>
              <Link
                href="https://t.me/arbiterx"
                className="ml-auto text-sm font-semibold text-white hover:text-white/80"
              >
                Open channel ↗
              </Link>
            </div>
          </div>
          <div className="flex-1 space-y-4 rounded-[30px] bg-[rgba(10,12,24,0.74)] p-6 shadow-[0_22px_60px_rgba(13,20,60,0.35)]">
            <h2 className="text-lg font-semibold text-white">Projected Daily Returns</h2>
            <p className="text-sm text-white/60">
              New trades launch every 2 hours. Actual payouts depend on your active balance at cycle start.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profitTable.map((item) => (
                <div
                  key={item.balance}
                  className="card-gradient flex flex-col rounded-[20px] px-5 py-4 text-white"
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                    Balance
                  </span>
                  <p className="text-2xl font-semibold">{item.balance.toFixed(2)} USDT</p>
                  <span className="mt-3 text-xs uppercase tracking-[0.22em] text-white/45">
                    Daily Profit
                  </span>
                  <p className="text-xl font-semibold text-[#43c984]">
                    +{item.daily.toFixed(2)} USDT
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40">
              Profits are distributed proportionally among all active users. ArbiterX retains a minor allocation for continuous R&D and support.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <div key={title} className="glass-panel flex flex-col gap-4 rounded-[24px] px-6 py-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_12px_28px_rgba(120,82,255,0.25)]">
              <Icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/65">{description}</p>
          </div>
        ))}
      </section>

      <section className="glass-panel flex flex-col gap-3 rounded-[28px] px-6 py-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            Referral rewards that scale with your community.
          </h2>
          <p className="text-sm text-white/65">
            Invite friends with your referral code to earn 5% instantly on each deposit and a 20% share of their ongoing profits. Your dashboard keeps real-time tabs on every referral cycle.
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-4 rounded-[24px] bg-[rgba(15,18,32,0.78)] p-6">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Referral Bonus</span>
            <span className="text-lg font-semibold text-[#43c984]">5%</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Profit Share</span>
            <span className="text-lg font-semibold text-[#7852ff]">20%</span>
          </div>
          <div className="rounded-2xl border border-dashed border-white/20 px-4 py-4 text-center text-sm text-white/65">
            Use code <span className="font-semibold text-white">ARB-START</span> when you sign up to unlock early-adopter analytics.
          </div>
        </div>
      </section>
    </div>
  );
}
