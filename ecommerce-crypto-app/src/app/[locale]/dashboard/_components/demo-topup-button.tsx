"use client";

import {useState, useTransition} from "react";
import {Loader2, Wallet} from "lucide-react";
import {useTranslations} from "next-intl";

import {createDemoTopUp} from "@/app/[locale]/dashboard/actions";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";

type DemoTopUpButtonProps = {
  locale: Locale;
};

export function DemoTopUpButton({locale}: DemoTopUpButtonProps) {
  const tDashboard = useTranslations("dashboard.overview");
  const successMessages = tDashboard.raw("success") as Record<string, string>;
  const errorMessages = tDashboard.raw("errors") as Record<string, string>;

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{type: "error" | "success"; message: string} | null>(null);

  const handleTopUp = () => {
    startTransition(async () => {
      const result = await createDemoTopUp(locale);
      if (!result.ok) {
        setFeedback({
          type: "error",
          message: errorMessages[result.error] ?? tDashboard("errors.USER_NOT_FOUND"),
        });
        return;
      }

      setFeedback({
        type: "success",
        message: successMessages.DEMO_TOPUP,
      });
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleTopUp}
        disabled={isPending}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 font-semibold text-white transition hover:border-white/40 hover:bg-white/15",
          isPending && "cursor-not-allowed opacity-70",
        )}
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5" />}
        {tDashboard("demoTopUp")}
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
    </div>
  );
}
