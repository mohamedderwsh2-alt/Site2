import {motion} from "framer-motion";
import {PlayIcon} from "lucide-react";
import {useTranslations} from "next-intl";

import {Link} from "@/i18n/routing";
import {cn} from "@/util/cn";

const featureGradients = [
  "from-violet-500/80 via-fuchsia-500/30 to-transparent",
  "from-cyan-400/80 via-sky-500/30 to-transparent",
  "from-amber-400/70 via-orange-500/20 to-transparent",
];

function FeatureCard({
  title,
  description,
  gradient,
  delay,
}: {
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{delay, duration: 0.4}}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", gradient)} />
      <div className="relative z-10 space-y-3">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-slate-200/80">{description}</p>
      </div>
    </motion.div>
  );
}

function ProfitTableRow({balance, profit}: {balance: string; profit: string}) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm backdrop-blur">
      <span className="font-medium text-slate-50">{balance} USDT</span>
      <span className="text-right text-emerald-300">{profit} USDT</span>
    </div>
  );
}

export default function LandingPage() {
  const tLanding = useTranslations("landing");
  const tNav = useTranslations("nav");
  const tApp = useTranslations("app");
  const tEarnings = useTranslations("earnings");
  const featureCards = tLanding.raw("featureCards") as Array<{title: string; description: string}>;
  const earningRows = tEarnings.raw("rows") as Array<{balance: string; profit: string}>;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-12 sm:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_rgba(15,23,42,0)_60%)]" />
      <header className="flex flex-col gap-8 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">OKX ↔ Binance</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{tApp("name")}</h1>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right text-xs text-slate-200/70">
            <span>{tApp("tagline")}</span>
            <span className="text-slate-200/50">v1.0 · Mobile-first</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-lg text-slate-200/80">{tLanding("heroSubtitle")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-sky-400 px-6 font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-300"
              >
                {tLanding("ctaPrimary")}
              </Link>
              <a
                href="#demo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 font-medium text-slate-50/90 transition hover:border-white/40"
              >
                <PlayIcon className="h-4 w-4" />
                {tLanding("ctaSecondary")}
              </a>
            </div>
          </motion.div>

          <motion.div
            id="demo"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1, duration: 0.6}}
            className="relative flex items-center justify-center"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-sky-500/30 via-cyan-400/20 to-transparent blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur">
              <motion.div
                initial={{rotate: -8, y: 20}}
                animate={{rotate: 0, y: 0}}
                transition={{duration: 0.8, delay: 0.2, type: "spring"}}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_rgba(15,23,42,0)_70%)]" />
                <div className="relative flex h-[520px] w-[260px] flex-col justify-between p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">Portfolio</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">+3.0% / 2h</h2>
                    <p className="mt-1 text-sm text-slate-200/70">Binance ↔ OKX</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200/80">
                      <div className="flex justify-between">
                        <span>USDT</span>
                        <span className="text-emerald-300">+91.60</span>
                      </div>
                      <p className="text-[0.65rem] text-slate-200/60">12:00 · Cycle 5 of 12</p>
                    </div>
                    <div className="flex justify-between text-sm text-slate-200/80">
                      <span>Next trade</span>
                      <span>01:58:32</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-100">{tLanding("demoTitle")}</h2>
        <p className="text-sm text-slate-200/70">{tLanding("demoDescription")}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              gradient={featureGradients[idx % featureGradients.length]}
              delay={0.15 * idx}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.45}}
          className="space-y-4 rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{tEarnings("title")}</h3>
            <span className="rounded-full border border-emerald-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-300/80">
              3% cycle split
            </span>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 rounded-2xl bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-200/60">
              <span>{tEarnings("tableHead.balance")}</span>
              <span className="text-right">{tEarnings("tableHead.profit")}</span>
            </div>
            {earningRows.map((row) => (
              <ProfitTableRow key={row.balance} balance={row.balance} profit={row.profit} />
            ))}
          </div>
          <p className="text-xs text-slate-200/60">{tEarnings("disclaimer")}</p>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{delay: 0.1, duration: 0.45}}
          className="flex flex-col gap-4 rounded-4xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-black/60 p-6 backdrop-blur-xl"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">Telegram</p>
            <h3 className="text-lg font-semibold">Premium support group</h3>
            <p className="text-sm text-slate-200/70">
              Connect with operations for deposit confirmations, bot updates, and performance snapshots.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 font-medium text-white transition hover:border-white/40"
          >
            {tNav("login")}
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-400 font-medium text-slate-950 transition hover:bg-emerald-300"
          >
            {tNav("register")}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
