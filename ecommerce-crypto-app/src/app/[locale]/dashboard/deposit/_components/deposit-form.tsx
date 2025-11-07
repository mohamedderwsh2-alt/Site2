"use client";

import {FormEvent, useState, useTransition} from "react";
import {Loader2} from "lucide-react";
import {useTranslations} from "next-intl";

import {createDepositRequest} from "@/app/[locale]/dashboard/deposit/actions";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";

type DepositFormProps = {
  locale: Locale;
};

export function DepositForm({locale}: DepositFormProps) {
  const tWallet = useTranslations("wallet");
  const tOverview = useTranslations("dashboard.overview");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [feedback, setFeedback] = useState<{type: "error" | "success"; message: string} | null>(null);
  const [isPending, startTransition] = useTransition();

  const errorMessages = tOverview.raw("errors") as Record<string, string>;
  const successMessages = {
    submitted: tWallet("depositSubmit"),
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFeedback({type: "error", message: errorMessages.INVALID_INPUT ?? "Invalid amount"});
      return;
    }

    startTransition(async () => {
      const result = await createDepositRequest(locale, {
        amount: parsedAmount,
        reference: reference.trim() || undefined,
      });

      if (!result.ok) {
        setFeedback({
          type: "error",
          message: errorMessages[result.error] ?? errorMessages.INVALID_INPUT ?? "Unable to submit",
        });
        return;
      }

      setFeedback({type: "success", message: successMessages.submitted});
      setAmount("");
      setReference("");
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
          className="w-full rounded-3xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-200/40 focus:border-sky-400/60 focus:outline-none"
          placeholder="100.00"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.3em] text-slate-200/60">{tWallet("depositReference")}</label>
        <input
          type="text"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className="w-full rounded-3xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-200/40 focus:border-sky-400/60 focus:outline-none"
          placeholder="TXID / Memo"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-400 font-semibold text-slate-950 transition hover:bg-sky-300",
          isPending && "cursor-not-allowed opacity-70",
        )}
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {tWallet("depositSubmit")}
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
