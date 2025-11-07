"use client";

import {FormEvent, useState} from "react";
import {signIn} from "next-auth/react";
import {Loader2, LockKeyhole, Mail} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";

import {Link} from "@/i18n/routing";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";
import {LocaleSwitcher} from "@/components/locale-switcher";

type LoginScreenProps = {
  locale: Locale;
};

export function LoginScreen({locale}: LoginScreenProps) {
  const tAuth = useTranslations("auth");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: `/${locale}/dashboard`,
    });

    setLoading(false);

    if (result?.error) {
      setError(tAuth("messages.invalidCredentials"));
      return;
    }

    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_rgba(15,23,42,0)_65%)]" />
      <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-4xl border border-white/10 bg-white/10 p-8 text-slate-50 backdrop-blur-2xl shadow-[0_40px_120px_rgba(15,118,230,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">ArbiPulse</p>
              <h1 className="mt-2 text-3xl font-semibold">{tAuth("login.title")}</h1>
            </div>
            <LocaleSwitcher currentLocale={locale} />
          </div>
          <p className="text-sm text-slate-200/70">{tAuth("login.subtitle")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">
                {tAuth("form.email")}
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 focus-within:border-sky-400/60">
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

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-200/60">
                {tAuth("form.password")}
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 focus-within:border-sky-400/60">
                <LockKeyhole className="h-4 w-4 text-slate-200/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-200/40 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-full bg-sky-400 font-medium text-slate-950 transition hover:bg-sky-300 disabled:opacity-70",
                loading && "cursor-progress",
              )}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : tAuth("login.cta")}
            </button>
          </form>

          <p className="text-center text-xs text-slate-200/60">
            {tAuth("login.noAccount")}{" "}
            <Link href="/auth/register" className="font-medium text-sky-300 transition hover:text-sky-200">
              {tAuth("login.goRegister")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
