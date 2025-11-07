"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
};

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, locale }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message ?? t("error"));
        return;
      }

      setSuccess(t("successRedirect"));
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="glass flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
      <div className="space-y-1">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          {...form.register("name", { required: true })}
          disabled={isPending}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...form.register("email", { required: true })}
          disabled={isPending}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...form.register("password", { required: true, minLength: 8 })}
            disabled={isPending}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...form.register("confirmPassword", {
              required: true,
              minLength: 8,
            })}
            disabled={isPending}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="referralCode">{t("referralCode")}</Label>
        <Input
          id="referralCode"
          placeholder="NEBULA23"
          {...form.register("referralCode")}
          disabled={isPending}
        />
      </div>
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
      <Button type="submit" fluid disabled={isPending} className="gap-2">
        {isPending && <Spinner className="h-4 w-4" />}
        {t("register")}
      </Button>
    </form>
  );
}
