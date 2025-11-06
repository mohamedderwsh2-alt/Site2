"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Home,
  LineChart,
  LogOut,
  Sparkles,
  UserRound,
  Wallet2,
} from "lucide-react";
import { useTranslation } from "@/i18n/TranslationProvider";

const navItems = [
  { href: "/app", icon: Home, labelKey: "nav.home" },
  { href: "/app/trade", icon: LineChart, labelKey: "nav.trade" },
  { href: "/app/wallet", icon: Wallet2, labelKey: "nav.wallet" },
  { href: "/app/profile", icon: UserRound, labelKey: "nav.profile" },
  { href: "/app/learn", icon: BookOpen, labelKey: "nav.learn" },
];

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dictionary } = useTranslation();

  const activePath = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-900/60 backdrop-blur-xl">
      <header className="flex items-center justify-between px-5 pb-4 pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
            FluxArb
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100">
            {dictionary.common.appName}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:bg-white/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{dictionary.profile.logout}</span>
        </button>
      </header>
      <div className="mx-5 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-xs text-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-200/70">{dictionary.home.balanceCard.nextCycle}</p>
            <p className="mt-1 text-sm font-semibold text-slate-50">
              {session?.user?.name ?? "—"}
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-indigo-200" />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-indigo-100/80">
          {dictionary.common.appTagline}
        </p>
      </div>
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePath ?? pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full overflow-y-auto px-5 pb-24 pt-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="fixed bottom-4 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-center justify-between px-5">
        <div className="flex w-full items-center justify-between rounded-3xl border border-white/10 bg-slate-900/90 px-3 py-3 text-xs text-slate-300 shadow-2xl shadow-indigo-900/30 backdrop-blur">
          {navItems.map(({ href, icon: Icon, labelKey }) => {
            const isActive = href === activePath;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-100"
                    : "text-slate-400 hover:text-indigo-100"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-indigo-200" : ""}`} />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  {labelKey
                    .split(".")
                    .reduce<any>((acc, key) => acc?.[key], dictionary) ?? labelKey}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      <footer className="hidden">
        <Link href="/support" className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>{dictionary.support.description}</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </footer>
    </div>
  );
};

export default AppShell;
