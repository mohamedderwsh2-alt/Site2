"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationProvider";

export default function LoginPage() {
  const { dictionary } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        if (result.status === 401) {
          setError(dictionary.errors.invalid_password);
          return;
        }
        setError(dictionary.errors.generic);
        return;
      }

      router.push(callbackUrl);
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
          {dictionary.auth.loginTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-300/70">
          {dictionary.auth.loginSubtitle}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </label>
        {error && (
          <p className="rounded-xl border border-rose-400/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-400/70"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {dictionary.auth.loginButton}
        </button>
      </form>
      <div className="flex flex-col gap-4 text-sm text-slate-300/80">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-slate-500">
            {dictionary.auth.rememberMe}
          </span>
          <span className="text-xs text-indigo-200">{dictionary.auth.forgotPassword}</span>
        </div>
        <div className="text-center text-sm text-slate-300/80">
          {dictionary.auth.switchToRegister}{" "}
          <Link href="/register" className="font-semibold text-indigo-300 hover:text-indigo-200">
            {dictionary.auth.registerButton}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
