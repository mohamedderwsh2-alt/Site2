"use client";

import { FormEvent, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS, tr as trLocale } from "date-fns/locale";
import { motion } from "framer-motion";
import { Copy, Loader2, ShieldCheck, Wallet2, WalletMinimal } from "lucide-react";
import { APP_CONFIG } from "@/config/app";
import type { OverviewData } from "@/lib/services/overview";
import { formatUSDT } from "@/lib/utils";
import { useTranslation } from "@/i18n/TranslationProvider";

interface WalletViewProps {
  data: OverviewData;
}

export const WalletView = ({ data }: WalletViewProps) => {
  const { dictionary, locale } = useTranslation();
  const [depositAmount, setDepositAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [depositNote, setDepositNote] = useState("");
  const [depositMessage, setDepositMessage] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);
  const [depositPending, startDeposit] = useTransition();
  const [withdrawPending, startWithdraw] = useTransition();

  const dateLocale = locale === "tr" ? trLocale : enUS;

  const submitDeposit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDepositMessage(null);

    const amount = parseFloat(depositAmount);
    if (Number.isNaN(amount) || amount < 5) {
      setDepositMessage(dictionary.wallet.minDeposit);
      return;
    }

    startDeposit(async () => {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, txHash: txHash || undefined, note: depositNote || undefined }),
      });

      if (!response.ok) {
        setDepositMessage(dictionary.errors.deposit_failed);
        return;
      }

      setDepositMessage(dictionary.successes.deposit_submitted);
      setDepositAmount("");
      setTxHash("");
      setDepositNote("");
    });
  };

  const submitWithdraw = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWithdrawMessage(null);

    const amount = parseFloat(withdrawAmount);
    if (Number.isNaN(amount) || amount < 5) {
      setWithdrawMessage(dictionary.wallet.minWithdraw);
      return;
    }

    startWithdraw(async () => {
      const response = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          address: withdrawAddress,
          password: withdrawPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const code = data?.error as keyof typeof dictionary.errors | undefined;
        if (code && dictionary.errors[code]) {
          setWithdrawMessage(dictionary.errors[code]);
        } else {
          setWithdrawMessage(dictionary.errors.withdraw_failed);
        }
        return;
      }

      setWithdrawMessage(dictionary.successes.withdraw_submitted);
      setWithdrawAmount("");
      setWithdrawAddress("");
      setWithdrawPassword("");
    });
  };

  return (
    <div className="space-y-6" id="deposit">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              {dictionary.wallet.depositTitle}
            </p>
            <p className="mt-2 text-sm text-slate-200/80">
              {dictionary.wallet.depositDescription}
            </p>
          </div>
          <Wallet2 className="h-6 w-6 text-indigo-200" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-indigo-100">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-[0.3em]">
              {dictionary.wallet.depositAddressLabel}
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(APP_CONFIG.depositAddress)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-indigo-100 transition hover:bg-indigo-500/20"
            >
              <Copy className="h-3.5 w-3.5" />
              {dictionary.common.copy}
            </button>
          </div>
          <p className="mt-3 break-all text-sm font-mono text-slate-100">
            {APP_CONFIG.depositAddress}
          </p>
          <p className="mt-3 text-[11px] text-slate-200/70">
            {dictionary.wallet.fixedAddressNote}
          </p>
        </div>
        <form onSubmit={submitDeposit} className="space-y-3 text-xs text-slate-200">
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.common.amount} ({dictionary.common.usdt})
            </span>
            <input
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              type="number"
              min={5}
              step="0.01"
              placeholder="100"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">TX Hash</span>
            <input
              value={txHash}
              onChange={(event) => setTxHash(event.target.value)}
              placeholder="0x..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">{dictionary.wallet.note}</span>
            <textarea
              value={depositNote}
              onChange={(event) => setDepositNote(event.target.value)}
              rows={2}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              placeholder="Additional information"
            />
          </label>
          {depositMessage && (
            <p className="rounded-2xl border border-indigo-400/50 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-100">
              {depositMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={depositPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-500/60"
          >
            {depositPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {dictionary.wallet.submitDeposit}
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-slate-100" id="withdraw">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-indigo-300">
              {dictionary.wallet.withdrawTitle}
            </p>
            <p className="mt-2 text-sm text-slate-200/80">
              {dictionary.wallet.withdrawDescription}
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-emerald-200" />
        </div>
        <form onSubmit={submitWithdraw} className="space-y-3 text-xs text-slate-200">
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.wallet.withdrawAmount}
            </span>
            <input
              value={withdrawAmount}
              onChange={(event) => setWithdrawAmount(event.target.value)}
              type="number"
              min={5}
              step="0.01"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.wallet.withdrawAddress}
            </span>
            <input
              value={withdrawAddress}
              onChange={(event) => setWithdrawAddress(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              placeholder="TRC20 wallet address"
              required
            />
          </label>
          <label className="block">
            <span className="uppercase tracking-widest text-indigo-200/70">
              {dictionary.wallet.withdrawPassword}
            </span>
            <input
              value={withdrawPassword}
              onChange={(event) => setWithdrawPassword(event.target.value)}
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              required
            />
          </label>
          {withdrawMessage && (
            <p className="rounded-2xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
              {withdrawMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={withdrawPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/60"
          >
            {withdrawPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {dictionary.wallet.withdrawSubmit}
          </button>
        </form>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            {dictionary.wallet.historyTitle}
          </h3>
          <WalletMinimal className="h-5 w-5 text-indigo-200" />
        </div>
        {data.wallet.deposits.length === 0 && data.wallet.withdrawals.length === 0 && (
          <p className="text-slate-400">{dictionary.common.empty.transactions}</p>
        )}
        <div className="space-y-2">
          {data.wallet.deposits.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-slate-100">{formatUSDT(entry.amount)}</p>
                <p className="text-[10px] uppercase tracking-widest text-indigo-200/70">
                  {dictionary.common.statuses[entry.status as keyof typeof dictionary.common.statuses]}
                </p>
              </div>
              <p className="text-[10px] text-slate-400">
                {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true, locale: dateLocale })}
              </p>
            </motion.div>
          ))}
          {data.wallet.withdrawals.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"
            >
              <div>
                <p className="font-semibold text-emerald-200">{formatUSDT(entry.amount)}</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-200/70">
                  {dictionary.common.statuses[entry.status as keyof typeof dictionary.common.statuses]}
                </p>
              </div>
              <p className="text-[10px] text-slate-400">
                {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true, locale: dateLocale })}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WalletView;
