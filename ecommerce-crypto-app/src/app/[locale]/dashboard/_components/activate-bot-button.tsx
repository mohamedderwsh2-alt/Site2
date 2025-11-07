"use client";

import {useState, useTransition} from "react";
import {Loader2, Sparkles} from "lucide-react";
import {useTranslations} from "next-intl";

import {activateTradingBot} from "@/app/[locale]/dashboard/actions";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";

type ActivateBotButtonProps = {
  locale: Locale;
  disabled?: boolean;
};

export function ActivateBotButton({locale, disabled}: ActivateBotButtonProps) {
  const tDashboard = useTranslations("dashboard.overview");
  const errorMessages = tDashboard.raw("errors") as Record<string, string>;
  const successMessages = tDashboard.raw("success") as Record<string, string>;

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{type: "error" | "success"; message: string} | null>(null);

  const handleActivate = () => {
    startTransition(async () => {
      const result = await activateTradingBot(locale);
      if (!result.ok) {
        setFeedback({
          type: "error",
          message: errorMessages[result.error] ?? tDashboard("errors.USER_NOT_FOUND"),
        });
        return;
      }

      setFeedback({
        type: "success",
        message: successMessages.BOT_ACTIVATED,
      });
    });
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleActivate}
        disabled={disabled || isPending}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 font-semibold text-slate-950 transition hover:bg-emerald-300",
          (disabled || isPending) && "cursor-not-allowed opacity-70",
        )}
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
        {tDashboard("activateBot")}
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
