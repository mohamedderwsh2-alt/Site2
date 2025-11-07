"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ReferralCardProps {
  code: string;
  shareLink: string;
  totalPartners: number;
  totalEarnings: number;
}

export function ReferralCard({
  code,
  shareLink,
  totalPartners,
  totalEarnings,
}: ReferralCardProps) {
  const t = useTranslations("referrals");
  const common = useTranslations("common");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    } catch (error) {
      console.error("Unable to copy referral link", error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-cyan-500/10">
      <CardTitle>{t("shareCode")}</CardTitle>
      <CardDescription className="mt-2 text-sm text-slate-200">
        {t("commissionExplainer")}
      </CardDescription>
      <div className="mt-4 rounded-[18px] border border-white/15 bg-white/10 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-200">
          {t("shareCode")}
        </p>
        <p className="mt-2 font-mono text-lg text-white">{code}</p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-[18px] border border-white/10 bg-white/10 p-3 text-sm text-white">
          {shareLink}
        </div>
        <Button variant="subtle" className="gap-2" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
          {copied ? common("copied") : t("copyLink")}
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
        <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            {t("totalPartners")}
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {totalPartners}
          </p>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            {t("lifetimeEarnings")}
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-200">
              {formatCurrency(totalEarnings)}
          </p>
        </div>
      </div>
      <Badge variant="outline" className="mt-4 w-fit text-slate-200">
        {t("shareCode")}
      </Badge>
    </Card>
  );
}
