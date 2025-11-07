"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardCopy, History } from "lucide-react";

import { DepositForm } from "@/components/wallet/deposit-form";
import { WithdrawForm } from "@/components/wallet/withdraw-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type WalletStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type WalletTransactionRecord = {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: WalletStatus;
  amount: number;
  createdAt: string;
  note?: string | null;
};

interface WalletTabsProps {
  defaultTab: "deposit" | "withdraw";
  centralAddress: string;
  balance: number;
  principal: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalEarnings: number;
  transactions: WalletTransactionRecord[];
}

export function WalletTabs({
  defaultTab,
  centralAddress,
  balance,
  principal,
  totalDeposited,
  totalWithdrawn,
  totalEarnings,
  transactions,
}: WalletTabsProps) {
  const t = useTranslations("wallet");
  const common = useTranslations("common");
  const [tab, setTab] = useState<"deposit" | "withdraw">(defaultTab);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const latestTransactions = useMemo(
    () => transactions.slice(0, 10),
    [transactions]
  );

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(centralAddress);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy USDT address", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-purple-500/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{formatCurrency(balance)}</CardTitle>
              <CardDescription>{t("walletBalance")}</CardDescription>
            </div>
            <Badge variant="outline" className="text-slate-200">
              {t("centralAddress")}
            </Badge>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/10 p-4 text-xs text-slate-200">
            <p className="break-all font-mono text-sm text-white">
              {centralAddress}
            </p>
            <Button
              variant="subtle"
              className="mt-3 w-full gap-2 text-xs"
              onClick={copyAddress}
            >
              <ClipboardCopy className="h-4 w-4" />
              {copied ? common("copied") : t("copyAddress")}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {t("totalDeposited")}
              </p>
              <p className="font-semibold text-white">
                {formatCurrency(totalDeposited)}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {t("totalWithdrawn")}
              </p>
              <p className="font-semibold text-white">
                {formatCurrency(totalWithdrawn)}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {t("capital")}
              </p>
              <p className="font-semibold text-white">
                {formatCurrency(principal)}
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {t("totalEarnings")}
              </p>
              <p className="font-semibold text-emerald-200">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="glass rounded-[28px] border border-white/10 bg-white/5 p-3">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button
            variant={tab === "deposit" ? "primary" : "subtle"}
            onClick={() => setTab("deposit")}
            className="gap-1"
          >
            {t("depositTitle")}
          </Button>
          <Button
            variant={tab === "withdraw" ? "primary" : "subtle"}
            onClick={() => setTab("withdraw")}
            className="gap-1"
          >
            {t("withdrawTitle")}
          </Button>
        </div>
        {tab === "deposit" ? (
          <DepositForm />
        ) : (
          <WithdrawForm balance={balance} />
        )}
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            {t("history")}
          </h2>
          <Badge variant="outline" className="gap-1 text-slate-300">
            <History className="h-3 w-3" />
            {latestTransactions.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {latestTransactions.length === 0 && (
            <Card>
              <CardDescription>{common("comingSoon")}</CardDescription>
            </Card>
          )}
          {latestTransactions.map((tx) => (
            <Card key={tx.id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {tx.type === "DEPOSIT" ? t("depositTitle") : t("withdrawTitle")}
                </CardTitle>
                <span className="text-sm font-semibold text-white">
                  {formatCurrency(tx.amount)}
                </span>
              </div>
              <CardDescription className="text-xs text-slate-300">
                {new Date(tx.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
              <Badge variant="outline" className="w-fit text-xs text-slate-200">
                {t(`status.${tx.status}`)}
              </Badge>
              {tx.note && (
                <p className="text-xs text-slate-300">{tx.note}</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
