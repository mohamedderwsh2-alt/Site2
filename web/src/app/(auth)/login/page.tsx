"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { IconLoader2, IconLock, IconMail } from "@tabler/icons-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message ?? "Unable to sign in");
      }

      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="glass-panel w-full rounded-[28px] px-8 py-10 shadow-[0_22px_48px_rgba(14,20,58,0.3)]">
      <div className="mb-8 space-y-2">
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
          Welcome back
        </span>
        <h1 className="text-3xl font-semibold text-white">Sign in to ArbiterX</h1>
        <p className="text-sm text-white/60">
          Track your arbitrage bot, monitor wallet balances, and claim referral earnings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="flex items-center gap-2 text-white/70">
            <IconMail size={18} /> Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="flex items-center gap-2 text-white/70">
            <IconLock size={18} /> Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
          />
        </label>

        {error && (
          <p className="rounded-2xl border border-[#ff6680]/30 bg-[#ff6680]/10 px-4 py-3 text-sm text-[#ff97a8]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed"
        >
          {pending ? (
            <>
              <IconLoader2 className="animate-spin" size={18} />
              Verifying credentials...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-white hover:text-white/80">
          Create one now
        </Link>
      </p>
    </div>
  );
}
