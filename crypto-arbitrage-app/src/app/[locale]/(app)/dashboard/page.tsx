import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CircleCheck,
  CircleDashed,
  LineChart,
  Sparkles,
} from "lucide-react";

import { ActivateBotButton } from "@/components/bot/activation-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { authOptions } from "@/server/auth/options";
import { syncBotTradesForUser } from "@/server/services/bot";
import { getDashboardSnapshot } from "@/server/queries/dashboard";

function formatRelativeTime(date: Date, locale: string) {
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 1) {
    const seconds = Math.round(diffMs / 1000);
    return rtf.format(seconds, "second");
  }
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }
  const days = Math.round(hours / 24);
  return rtf.format(days, "day");
}

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  await syncBotTradesForUser(session.user.id);

  const snapshot = await getDashboardSnapshot(session.user.id);
  if (!snapshot) {
    redirect(`/${params.locale}/login`);
  }

  const [dashboard, common, wallet] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "dashboard" }),
    getTranslations({ locale: params.locale, namespace: "common" }),
    getTranslations({ locale: params.locale, namespace: "wallet" }),
  ]);

  const { user, stats, recentTrades, recentTransactions } = snapshot;
  type TradeRecord = (typeof recentTrades)[number];
  type TransactionRecord = (typeof recentTransactions)[number];
  const displayName = user.name ?? "Trader";

  const nextCycle =
    stats.nextTrade &&
    new Intl.DateTimeFormat(params.locale, {
      hour: "numeric",
      minute: "numeric",
    }).format(stats.nextTrade);

  return (
    <main className="flex flex-col gap-6 pb-6">
      <section className="glass flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">
              {dashboard("greeting", { name: displayName })}
            </p>
            <h1 className="text-2xl font-semibold text-white">Nebula Pulse</h1>
          </div>
          {user.botActive ? (
            <Badge variant="success" className="gap-1">
              <CircleCheck className="h-3 w-3" />
              {dashboard("botActive")}
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1 text-amber-200">
              <CircleDashed className="h-3 w-3" />
              {dashboard("activateBot")}
            </Badge>
          )}
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {dashboard("capital")}
              </p>
              <p className="text-xl font-semibold text-white">
                {formatCurrency(Number(user.botPrincipal))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {dashboard("walletBalance")}
              </p>
              <p className="text-lg font-semibold text-emerald-200">
                {formatCurrency(Number(user.walletBalance))}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {dashboard("todayProfit")}
              </p>
              <p className="mt-1 font-semibold text-emerald-200">
                {formatCurrency(stats.today.profit)}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {dashboard("cycleProfit")}
              </p>
              <p className="mt-1 font-semibold text-white">
                {formatCurrency(stats.cycleProfit)}
              </p>
            </div>
          </div>
        </div>
        {!user.botActive && (
          <ActivateBotButton disabled={Number(user.walletBalance) < 5} />
        )}
        {user.botActive && (
          <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {dashboard("nextCycle")}
              </p>
              <p className="font-medium text-white">{nextCycle ?? "—"}</p>
            </div>
            <Badge variant="outline" className="gap-1 text-slate-200">
              <Sparkles className="h-3 w-3" />
              {stats.today.cycles} cycles
            </Badge>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {dashboard("quickActions")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/wallet?tab=deposit">
            <Card className="flex flex-col gap-2 bg-gradient-to-br from-sky-500/15 to-purple-500/10">
              <CardTitle>{dashboard("deposit")}</CardTitle>
              <CardDescription>{common("functional")}</CardDescription>
            </Card>
          </Link>
          <Link href="/wallet?tab=withdraw">
            <Card className="flex flex-col gap-2 bg-gradient-to-br from-emerald-500/15 to-teal-500/10">
              <CardTitle>{dashboard("withdraw")}</CardTitle>
              <CardDescription>{common("functional")}</CardDescription>
            </Card>
          </Link>
          <Link href="/bot">
            <Card className="flex flex-col gap-2 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10">
              <CardTitle>{dashboard("viewBot")}</CardTitle>
              <CardDescription>{common("demoOnly")}</CardDescription>
            </Card>
          </Link>
          <Link href="/referrals">
            <Card className="flex flex-col gap-2 bg-gradient-to-br from-pink-500/15 to-orange-500/10">
              <CardTitle>{dashboard("referralEarnings")}</CardTitle>
              <CardDescription>
                {formatCurrency(stats.referralVolume)}
              </CardDescription>
            </Card>
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {dashboard("recentTrades")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-300">
            <LineChart className="h-3 w-3" />
            {stats.today.cycles} today
          </Badge>
        </div>
        <div className="flex flex-col gap-3">
          {recentTrades.length === 0 && (
            <Card>
              <CardDescription>{dashboard("emptyState")}</CardDescription>
            </Card>
          )}
          {recentTrades.slice(0, 4).map((trade: TradeRecord) => {
            const snapshot = trade.strategySnapshot
              ? (JSON.parse(trade.strategySnapshot) as {
                  spread: number;
                  okxPrice: number;
                  binancePrice: number;
                })
              : null;
            return (
              <Card key={trade.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    +{formatCurrency(Number(trade.profitAmount))}
                  </p>
                  <span className="text-xs text-slate-300">
                    {formatRelativeTime(
                      new Date(trade.tradeWindowEnd),
                      params.locale
                    )}
                  </span>
                </div>
                {snapshot && (
                  <p className="text-xs text-slate-300">
                    Spread {snapshot.spread}% · OKX {snapshot.okxPrice} · Binance{" "}
                    {snapshot.binancePrice}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {dashboard("recentActivity")}
          </h2>
          <Link href="/wallet">
            <Button variant="ghost" className="gap-1 text-xs text-sky-300">
              {common("viewAll")} <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {recentTransactions.length === 0 && (
            <Card>
              <CardDescription>{dashboard("emptyState")}</CardDescription>
            </Card>
          )}
          {recentTransactions.map((tx: TransactionRecord) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {tx.type === "DEPOSIT"
                    ? dashboard("deposit")
                    : dashboard("withdraw")}
                </p>
                <p className="text-xs text-slate-300">
                  {formatRelativeTime(new Date(tx.createdAt), params.locale)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(Number(tx.amount))}
                </p>
                <p className="text-xs text-slate-400">
                  {wallet(`status.${tx.status}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
