"use client";

import {FormEvent, useState, useTransition} from "react";
import {Loader2} from "lucide-react";
import {useTranslations} from "next-intl";

import {createWithdrawRequest} from "@/app/[locale]/dashboard/withdraw/actions";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";

type WithdrawFormProps = {
  locale: Locale;
};

export function WithdrawForm({locale}: WithdrawFormProps) {
  const tWallet = useTranslations("wallet");
  const tOverview = useTranslations("dashboard.overview");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{type: "error" | "success"; message: string} | null>(null);
  const [isPending, startTransition] = useTransition();

  const errorMessages = tOverview.raw("errors") as Record<string, string>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedback({type: "error", message: errorMessages.INVALID_INPUT ?? "Invalid amount"});
      return;
    }

    startTransition(async () => {
      const result = await createWithdrawRequest(locale, {
        amount: parsedAmount,
        address: address.trim(),
        password,
      });

      if (!result.ok) {
        setFeedback({
          type: "error",
          message: errorMessages[result.error] ?? errorMessages.INVALID_INPUT ?? "Unable to submit",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: tWallet("withdrawSubmit"),
      });
      setAmount("");
      setAddress("");
      setPassword("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tWallet("withdrawAmount")}</label>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-full rounded-3xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-200/40 focus:border-emerald-400/60 focus:outline-none"
          placeholder="50.00"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tWallet("withdrawAddress")}</label>
        <input
          type="text"
          required
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full rounded-3xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-200/40 focus:border-emerald-400/60 focus:outline-none"
          placeholder="TRC20 / ERC20 address"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tWallet("withdrawPassword")}</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-3xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-200/40 focus:border-emerald-400/60 focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-400 font-semibold text-slate-950 transition hover:bg-emerald-300",
          isPending && "cursor-not-allowed opacity-70",
        )}
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {tWallet("withdrawSubmit")}
      </button>
      {feedback ? (
        <p
          className={cn(
            "rounded-3xl border px-4 py-3 text-xs",
            feedback.type === "error"
              ? "border-red-400/40 bg-red-500/10 text-red-100"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
