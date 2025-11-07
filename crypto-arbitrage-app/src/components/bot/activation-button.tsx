"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ActivateBotButton({
  disabled,
}: {
  disabled?: boolean;
}) {
  const router = useRouter();
  const notifications = useTranslations("notifications");
  const dashboard = useTranslations("dashboard");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <Button
        fluid
        className="gap-2"
        disabled={disabled || isPending}
        onClick={() => {
          setError(null);
          setSuccess(null);
          startTransition(async () => {
            const response = await fetch("/api/bot/purchase", {
              method: "POST",
            });
            const result = await response.json();
            if (!response.ok) {
              setError(result.message ?? notifications("error"));
              return;
            }
            setSuccess(notifications("botActivated"));
            router.refresh();
          });
        }}
      >
        {isPending ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
        {dashboard("activateBot")}
      </Button>
      {error && (
        <p className="rounded-[16px] border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-[16px] border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {success}
        </p>
      )}
    </div>
  );
}
