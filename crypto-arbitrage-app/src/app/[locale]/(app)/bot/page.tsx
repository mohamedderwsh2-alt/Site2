import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { Activity, Clock } from "lucide-react";

import { DemoVisuals } from "@/components/bot/demo-visuals";
import { SpreadWidget } from "@/components/bot/spread-widget";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";
import { getDashboardSnapshot } from "@/server/queries/dashboard";
import { syncBotTradesForUser } from "@/server/services/bot";

export default async function BotPage({ params }: { params: { locale: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    redirect(`/${params.locale}/login`);
  }

  await syncBotTradesForUser(session.user.id);

  const snapshot = await getDashboardSnapshot(session.user.id);
  if (!snapshot) {
    redirect(`/${params.locale}/login`);
  }

  type BotTradeRecord = Awaited<
    ReturnType<typeof prisma.botTrade.findMany>
  >[number];

  const trades: BotTradeRecord[] = await prisma.botTrade.findMany({
    where: { userId: session.user.id },
    orderBy: { tradeWindowEnd: "desc" },
    take: 20,
  });

  const parser = new Intl.DateTimeFormat(params.locale, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });

  const [bot, common] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "bot" }),
    getTranslations({ locale: params.locale, namespace: "common" }),
  ]);

  return (
    <main className="flex flex-col gap-6 pb-6">
      <section className="grid gap-4">
        <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent">
          <CardTitle>{bot("cyclesCompleted")}</CardTitle>
          <p className="mt-2 text-3xl font-semibold text-white">
            {snapshot.stats.today.cycles}
          </p>
          <CardDescription className="mt-2 text-sm text-slate-300">
            {bot("summary")}
          </CardDescription>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-purple-500/10">
          <CardTitle>{bot("profitPerCycle")}</CardTitle>
          <p className="mt-2 text-3xl font-semibold text-emerald-200">
            {formatCurrency(snapshot.stats.cycleProfit)}
          </p>
          <CardDescription className="mt-2 text-sm text-slate-200">
            {bot("capitalEmployed")}
          </CardDescription>
        </Card>
      </section>

      <SpreadWidget />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {bot("tradeFeed")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-300">
            <Activity className="h-3 w-3" /> {bot("liveBadge")}
          </Badge>
        </div>
        <div className="flex flex-col gap-3">
          {trades.length === 0 && (
            <Card>
              <CardDescription>{bot("noTrades")}</CardDescription>
            </Card>
          )}
          {trades.map((trade) => {
            const snapshotDetails = trade.strategySnapshot
              ? (JSON.parse(trade.strategySnapshot) as {
                  spread?: number;
                  okxPrice?: number;
                  binancePrice?: number;
                })
              : null;
            return (
              <Card key={trade.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">
                    +{formatCurrency(Number(trade.profitAmount))}
                  </CardTitle>
                  <span className="text-xs text-slate-300">
                    {parser.format(new Date(trade.tradeWindowEnd))}
                  </span>
                </div>
                <CardDescription className="text-xs text-slate-300">
                  Base capital: {formatCurrency(Number(trade.baseBalance))} · Latency{" "}
                  {trade.executionLatency ?? 18} ms
                </CardDescription>
                {snapshotDetails && (
                  <p className="text-xs text-slate-200">
                    Spread {snapshotDetails.spread ?? 3}% · OKX{" "}
                    {snapshotDetails.okxPrice} · Binance {snapshotDetails.binancePrice}
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
              {bot("demoHeadline")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-300">
            <Clock className="h-3 w-3" />
              {common("demoOnly")}
          </Badge>
        </div>
        <Card className="border border-amber-500/30 bg-amber-500/10 text-amber-100">
          <CardDescription>
              {bot("demoNotice")}
          </CardDescription>
        </Card>
        <DemoVisuals />
      </section>
    </main>
  );
}
