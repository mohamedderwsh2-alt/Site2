"use client";

import {useState} from "react";
import {Copy} from "lucide-react";
import {useTranslations} from "next-intl";

type ReferralCodeCardProps = {
  code: string;
};

export function ReferralCodeCard({code}: ReferralCodeCardProps) {
  const tDashboard = useTranslations("dashboard.overview");
  const tReferral = useTranslations("referral");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <div className="space-y-3 rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tDashboard("referralCode")}</p>
        <p className="mt-3 text-2xl font-semibold tracking-[0.4em] text-white">{code}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 font-medium text-white transition hover:border-white/40"
      >
        <Copy className="h-4 w-4" />
        {copied ? tDashboard("copied") : tDashboard("copy")}
      </button>
      <p className="text-xs text-slate-200/60">{tReferral("headline")}</p>
    </div>
  );
}
