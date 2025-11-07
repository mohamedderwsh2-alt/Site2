import { Fragment } from "react";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronRight, Sparkles, Wallet, Zap } from "lucide-react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PROFIT_TIERS } from "@/lib/profit";
import { formatCurrency } from "@/lib/utils";

export default function LandingPage() {
  const t = useTranslations();
  const heroSteps = t.raw("landing.howItWorksSteps") as string[];
  const featureCards = t.raw("landing.featureCards") as {
    title: string;
    description: string;
  }[];

  return (
    <main className="flex flex-col gap-10 pb-16">
      <header className="glass relative overflow-hidden rounded-[34px] border border-white/10 bg-white/10 px-6 pb-8 pt-6 shadow-xl">
        <div className="pointer-events-none absolute -top-24 -right-14 h-48 w-48 rounded-full bg-sky-500/30 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/20 blur-[60px]" />
        <div className="flex items-center justify-between">
          <Badge variant="outline">{t("common.functional")}</Badge>
          <LocaleSwitcher />
        </div>
        <div className="mt-6 flex flex-col gap-5">
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
            {t("landing.heroHeadline")}
          </h1>
          <p className="text-sm text-slate-200 md:text-base">
            {t("landing.heroTagline")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button fluid className="gap-2">
                {t("landing.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="sm:flex-1"
            >
              <Button variant="outline" fluid className="gap-2">
                <Sparkles className="h-4 w-4" />
                {t("landing.ctaSecondary")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="glass rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {t("landing.howItWorks")}
          </h2>
          <Badge variant="success" className="gap-1">
            <Zap className="h-3 w-3" /> {t("common.functional")}
          </Badge>
        </div>
        <ol className="flex flex-col gap-4">
          {heroSteps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-4 rounded-[18px] border border-white/10 bg-white/5 p-4"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-200">
                {index + 1}
              </span>
              <p className="text-sm text-slate-200">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="glass flex flex-col gap-5 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {t("landing.profitShowcase")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-200">
            <Wallet className="h-3 w-3" />
            Arbitrage
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              Balance
            </span>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 text-right">
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              Daily Profit
            </span>
          </div>
          {PROFIT_TIERS.map((tier) => (
            <Fragment key={tier.balance}>
              <div
                className="rounded-[18px] border border-white/10 bg-gradient-to-r from-white/10 to-white/0 p-4 font-semibold text-white"
              >
                {formatCurrency(tier.balance)}
              </div>
              <div
                className="rounded-[18px] border border-white/10 bg-gradient-to-l from-emerald-500/10 to-white/0 p-4 text-right font-semibold text-emerald-200"
              >
                {formatCurrency(tier.dailyProfit)}
              </div>
            </Fragment>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
          {t("landing.featuresTitle")}
        </h2>
        <div className="flex flex-col gap-3">
          {featureCards.map((feature) => (
            <Card key={feature.title}>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section className="glass space-y-4 rounded-[28px] border border-white/10 bg-gradient-to-r from-indigo-500/20 via-cyan-500/15 to-purple-500/10 p-6 text-white shadow-lg">
        <h2 className="text-xl font-semibold">
          {t("landing.referralHighlight")}
        </h2>
        <p className="text-sm text-slate-200">
          {t("referrals.commissionExplainer")}
        </p>
        <Link href="/register">
          <Button variant="outline" fluid className="gap-2">
            <ChevronRight className="h-4 w-4" />
            {t("referrals.shareCode")}
          </Button>
        </Link>
      </section>

      <section className="glass rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">
          {t("landing.supportHeadline")}
        </h2>
        <p className="mt-2 text-sm text-slate-200">
          {t("landing.supportCopy")}
        </p>
        <Link
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex"
        >
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            {t("landing.telegramButton")}
          </Button>
        </Link>
      </section>
    </main>
  );
}
