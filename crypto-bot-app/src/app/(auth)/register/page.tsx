"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, User, Gift } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationProvider";

export default function RegisterPage() {
  const { dictionary, locale } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          language: locale,
          referralCode: referralCode || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const code = data?.error as keyof typeof dictionary.errors | undefined;
        if (code && dictionary.errors[code]) {
          setError(dictionary.errors[code]);
        } else {
          setError(dictionary.errors.registration_failed);
        }
        return;
      }

      setSuccess(dictionary.auth.successRegistered);

      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      router.push("/app");
      router.refresh();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">
          {dictionary.auth.registerTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-300/70">
          {dictionary.auth.registerSubtitle}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            {dictionary.auth.name}
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-indigo-400">
            <User className="h-4 w-4 text-indigo-300" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Satoshi Nakamoto"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            {dictionary.auth.email}
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-indigo-400">
            <Mail className="h-4 w-4 text-indigo-300" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            {dictionary.auth.password}
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-indigo-400">
            <Lock className="h-4 w-4 text-indigo-300" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 karakter"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            {dictionary.auth.referralCode}
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-indigo-400">
            <Gift className="h-4 w-4 text-indigo-300" />
            <input
              value={referralCode}
              onChange={(event) => setReferralCode(event.target.value)}
              placeholder="CBXXXXXX"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </label>
        {error && (
          <p className="rounded-xl border border-rose-400/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            {success}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-400/70"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {dictionary.auth.registerButton}
        </button>
      </form>
      <p className="text-center text-sm text-slate-300/80">
        {dictionary.auth.switchToLogin}{" "}
        <Link href="/login" className="font-semibold text-indigo-300 hover:text-indigo-200">
          {dictionary.auth.loginButton}
        </Link>
      </p>
    </motion.div>
  );
}
