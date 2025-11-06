import { IconGift, IconLink, IconUsersGroup } from "@tabler/icons-react";
import { demoReferrals, demoUser } from "@/lib/demo-data";

const referralCode = "ARB-SERRA42";

export default function ReferralsPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-6 text-white">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Referral hub
          </span>
          <h1 className="text-2xl font-semibold">Grow your passive income</h1>
          <p className="text-sm text-white/65">
            Share ArbiterX with friends and receive instant 5% deposit rewards plus 20% of their trading profits forever.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] bg-white/5 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-white/55">Your code</span>
            <p className="mt-2 text-xl font-semibold">{referralCode}</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">
            <IconLink size={16} /> Copy referral link
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Active members</p>
            <p className="mt-2 text-2xl font-semibold">{demoUser.referralCount}</p>
            <p className="text-xs text-white/50">Direct invites currently running the bot.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Daily passive income</p>
            <p className="mt-2 text-2xl font-semibold text-[#43c984]">
              +{demoUser.referralEarnings.toFixed(2)} USDT
            </p>
            <p className="text-xs text-white/50">20% of profits distributed automatically.</p>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] px-6 py-6 text-white">
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconUsersGroup size={20} className="text-[#7852ff]" />
            <h2 className="text-lg font-semibold">Direct referrals</h2>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            {demoReferrals.length} members
          </span>
        </header>

        <div className="divide-y divide-white/10">
          {demoReferrals.map((referral) => (
            <article
              key={referral.email}
              className="grid gap-4 py-4 text-sm text-white/75 sm:grid-cols-4 sm:items-center"
            >
              <div>
                <p className="font-semibold text-white">{referral.name}</p>
                <p className="text-xs text-white/50">{referral.email}</p>
              </div>
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                Deposit
                <strong className="text-sm text-white">{referral.deposit.toFixed(2)} USDT</strong>
              </span>
              <span className="text-sm text-[#d7c9ff]">
                Instant bonus: +{referral.instantBonus.toFixed(2)} USDT
              </span>
              <span className="text-sm text-[#43c984]">
                Daily share: +{referral.profitShare.toFixed(2)} USDT
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 rounded-[24px] px-6 py-5 text-sm text-white/70">
        <div className="flex items-center gap-2 text-white">
          <IconGift size={18} /> Bonus structure recap
        </div>
        <ul className="space-y-3">
          <li>
            <strong className="text-white">5% instant reward</strong> – credited to your wallet as soon as your referral&apos;s deposit is confirmed.
          </li>
          <li>
            <strong className="text-white">20% lifetime share</strong> – auto-distributed after each 2-hour trading cycle.
          </li>
          <li>
            <strong className="text-white">Transparent tracking</strong> – see every referral trade and commission in your dashboard timeline.
          </li>
        </ul>
      </section>
    </div>
  );
}
