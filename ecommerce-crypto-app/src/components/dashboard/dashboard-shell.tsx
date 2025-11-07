"use client";

import {ReactNode} from "react";
import {LogOut, PieChart, Sparkles, Wallet, UsersRound, BookOpen} from "lucide-react";
import {signOut} from "next-auth/react";
import {useTranslations} from "next-intl";

import {Link, pathnames, usePathname} from "@/i18n/routing";
import {Locale} from "@/util/i18n";
import {cn} from "@/util/cn";
import {LocaleSwitcher} from "@/components/locale-switcher";

type DashboardShellProps = {
  locale: Locale;
  userEmail?: string | null;
  children: ReactNode;
};

export function DashboardShell({locale, userEmail, children}: DashboardShellProps) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  type AppRoute = keyof typeof pathnames;

  const navItems: Array<{href: AppRoute; icon: typeof PieChart; label: string}> = [
    {href: "/dashboard", icon: PieChart, label: tNav("dashboard")},
    {href: "/dashboard/deposit", icon: Wallet, label: tNav("deposit")},
    {href: "/dashboard/withdraw", icon: Sparkles, label: tNav("withdraw")},
    {href: "/dashboard/referrals", icon: UsersRound, label: tNav("referrals")},
    {href: "/dashboard/articles", icon: BookOpen, label: tNav("articles")},
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_rgba(15,23,42,0)_70%)]" />
      <header className="flex items-center justify-between px-6 pb-4 pt-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-200/60">ArbiPulse</p>
          <h1 className="text-xl font-semibold text-white">{userEmail ?? "Trader"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale} />
          <button
            type="button"
            onClick={() => signOut({callbackUrl: `/${locale}`})}
            className="inline-flex h-9 items-center justify-center rounded-full border border-white/20 bg-white/5 px-3 text-xs text-slate-200/80 transition hover:border-white/40 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {tNav("logout")}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden px-4 pb-28 sm:px-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-4 z-10 mx-auto flex w-[min(420px,90%)] justify-between rounded-3xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[0.7rem] font-medium transition",
                isActive ? "bg-white/10 text-white" : "text-slate-200/60 hover:text-slate-200/90",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
