"use client";

import {FormEvent, useState} from "react";
import {Loader2, LockKeyhole, Mail, UserRound} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";

import {LocaleSwitcher} from "@/components/locale-switcher";
import {Link} from "@/i18n/routing";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";

type RegisterScreenProps = {
  locale: Locale;
};

export function RegisterScreen({locale}: RegisterScreenProps) {
  const tAuth = useTranslations("auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        referralCode: referralCode.trim() || undefined,
        locale,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const {error: message} = await response.json();
      setError(message ?? tAuth("messages.genericError"));
      return;
    }

    setSuccess(true);
  };

  const handleRedirectLogin = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_rgba(15,23,42,0)_65%)]" />
      <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="flex w-full max-w-xl flex-col gap-6 rounded-4xl border border-white/10 bg-white/10 p-8 text-slate-50 backdrop-blur-2xl shadow-[0_40px_120px_rgba(16,185,129,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">ArbiPulse</p>
              <h1 className="mt-2 text-3xl font-semibold">{tAuth("register.title")}</h1>
            </div>
            <LocaleSwitcher currentLocale={locale} />
          </div>
          <p className="text-sm text-slate-200/70">{tAuth("register.subtitle")}</p>

          {success ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-emerald-300/40 bg-emerald-400/10 px-6 py-10 text-center">
              <h2 className="text-lg font-semibold text-emerald-200">{tAuth("messages.registerSuccess")}</h2>
              <button
                type="button"
                onClick={handleRedirectLogin}
                className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 font-medium text-slate-950 transition hover:bg-emerald-300"
              >
                {tAuth("register.goLogin")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">{tAuth("form.name")}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 focus-within:border-emerald-400/60">
                    <UserRound className="h-4 w-4 text-slate-200/60" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-200/40 focus:outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">{tAuth("form.email")}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 focus-within:border-emerald-400/60">
                    <Mail className="h-4 w-4 text-slate-200/60" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-200/40 focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">{tAuth("form.password")}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 focus-within:border-emerald-400/60">
                    <LockKeyhole className="h-4 w-4 text-slate-200/60" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-200/40 focus:outline-none"
                      placeholder="At least 8 characters"
                      minLength={8}
                    />
                  </div>
                </label>

                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">
                    {tAuth("form.referral")}
                  </span>
                  <div className="rounded-2xl border border-dashed border-white/20 bg-black/10 px-4 py-3 focus-within:border-emerald-400/60">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                      className="w-full bg-transparent text-sm uppercase tracking-[0.3em] text-white placeholder:text-slate-200/40 focus:outline-none"
                      placeholder="ABCD1234"
                    />
                  </div>
                </label>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 font-medium text-slate-950 transition hover:bg-emerald-300 disabled:opacity-70",
                  loading && "cursor-progress",
                )}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : tAuth("register.cta")}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-200/60">
            {tAuth("register.haveAccount")}{" "}
            <Link href="/auth/login" className="font-medium text-emerald-300 transition hover:text-emerald-200">
              {tAuth("register.goLogin")}
            </Link>
          </p>
          <p className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-[0.65rem] text-slate-200/60">
            {tAuth("form.tos")}
          </p>
        </div>
      </div>
    </div>
  );
}
