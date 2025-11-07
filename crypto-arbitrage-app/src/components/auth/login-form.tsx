"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="glass flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
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
      <div className="space-y-1">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password", { required: true })}
          disabled={isPending}
        />
      </div>
      {error && (
        <p className="rounded-[16px] border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
      <Button type="submit" fluid disabled={isPending} className="gap-2">
        {isPending && <Spinner className="h-4 w-4" />}
        {t("login")}
      </Button>
    </form>
  );
}
