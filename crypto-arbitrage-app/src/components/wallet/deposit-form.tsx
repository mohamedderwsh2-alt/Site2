"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

type DepositFormValues = {
  amount: number;
  txHash?: string;
  note?: string;
};

export function DepositForm() {
  const t = useTranslations("wallet");
  const notify = useTranslations("notifications");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const form = useForm<DepositFormValues>({
    defaultValues: {
      amount: 50,
      txHash: "",
      note: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) {
        setFeedback({
          type: "error",
          text: result.message ?? notify("error"),
        });
        return;
      }

      setFeedback({
        type: "success",
        text: notify("depositSubmitted"),
      });
      form.reset();
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="deposit-amount">{t("amount")}</Label>
        <Input
          id="deposit-amount"
          type="number"
          step="0.01"
          min={1}
          placeholder="100"
          {...form.register("amount", { required: true, min: 1 })}
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="deposit-hash">{t("txHash")}</Label>
        <Input
          id="deposit-hash"
          placeholder="0x..."
          {...form.register("txHash")}
          disabled={isPending}
        />
      </div>
      <div>
        <Label htmlFor="deposit-note">{t("note")}</Label>
        <Textarea
          id="deposit-note"
          placeholder="Any memo or reference"
          {...form.register("note")}
          disabled={isPending}
        />
      </div>
      {feedback && (
        <p
          className={`rounded-[16px] border px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-red-500/40 bg-red-500/10 text-red-100"
          }`}
        >
          {feedback.text}
        </p>
      )}
      <Button type="submit" fluid disabled={isPending} className="gap-2">
        {isPending && <Spinner className="h-4 w-4" />}
        {t("submit")}
      </Button>
    </form>
  );
}
