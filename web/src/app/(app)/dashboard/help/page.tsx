import Link from "next/link";
import { IconBook2, IconBrandTelegram, IconInfoCircle } from "@tabler/icons-react";

const article = {
  title: "How Does the Bot Generate Profit?",
  body: [
    "Our trading bot takes advantage of price differences between OKX and Binance.",
    "Every two hours, it analyzes the market automatically.",
    "When the price difference between the two exchanges exceeds 3%, the system executes an instant buy/sell trade.",
    "The bot uses only 10% of each user’s balance per trade, minimizing risk during market fluctuations.",
    "Each operation is completed in under 50 milliseconds (0.05 seconds).",
    "After each trade, the profits are distributed equally (3%) among all active users.",
    "A small remaining portion is reserved by the system for bot development and team salaries, ensuring continuous and sustainable platform growth.",
  ],
};

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="glass-panel rounded-[28px] px-6 py-6 text-white">
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Knowledge base
          </span>
          <h1 className="text-2xl font-semibold">Support & Operations</h1>
          <p className="text-sm text-white/65">
            Reach out to our Telegram operations center or browse the knowledge base to understand how ArbiterX keeps your bot profitable.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-white/5 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Telegram support</p>
            <p className="mt-2 text-lg font-semibold text-white">@arbiterx-operations</p>
            <p className="text-xs text-white/50">
              Available 24/7 for deposits, withdrawals, and incident reports.
            </p>
          </div>
          <Link
            href="https://t.me/arbiterx"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            <IconBrandTelegram size={18} /> Open Telegram group
          </Link>
        </div>
      </section>

      <section className="glass-panel flex flex-col gap-4 rounded-[28px] px-6 py-6 text-white">
        <div className="flex items-center gap-2">
          <IconBook2 size={20} className="text-[#7852ff]" />
          <h2 className="text-lg font-semibold">{article.title}</h2>
        </div>
        <article className="space-y-4 text-sm text-white/70">
          {article.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </section>

      <section className="glass-panel flex flex-col gap-3 rounded-[24px] px-6 py-5 text-sm text-white/70">
        <div className="flex items-center gap-2 text-white">
          <IconInfoCircle size={18} /> Need more help?
        </div>
        <p>
          Email <Link href="mailto:support@arbiterx.ai" className="text-white underline">support@arbiterx.ai</Link> or open a ticket in the dashboard. Our SLA for ticket responses is under 1 hour.
        </p>
      </section>
    </div>
  );
}
