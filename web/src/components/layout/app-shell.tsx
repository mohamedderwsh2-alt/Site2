"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconChartArcs,
  IconWallet,
  IconUsersGroup,
  IconHelpOctagon,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: IconHome },
  { href: "/dashboard/trades", label: "Trades", icon: IconChartArcs },
  { href: "/dashboard/wallet", label: "Wallet", icon: IconWallet },
  { href: "/dashboard/referrals", label: "Network", icon: IconUsersGroup },
  { href: "/dashboard/help", label: "Support", icon: IconHelpOctagon },
];

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen w-full justify-center">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 mx-auto h-[480px] max-w-4xl bg-[radial-gradient(circle_at_top,rgba(120,82,255,0.26),transparent_62%)]" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 mx-auto h-[420px] max-w-4xl bg-[radial-gradient(circle_at_bottom,rgba(146,102,255,0.22),transparent_70%)]" />

        <div className="relative z-10 flex w-full max-w-lg flex-col gap-6 px-4 py-5 sm:max-w-2xl sm:px-6">
          <header className="glass-panel flex items-center justify-between rounded-[24px] px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium uppercase tracking-[0.32em] text-[rgb(var(--foreground-muted))]">
              ArbiterX Bot Network
            </span>
            <h1 className="text-2xl font-semibold text-[rgb(var(--foreground))] sm:text-3xl">
              {title ?? "Smart Arbitrage Hub"}
            </h1>
            {subtitle ? (
              <p className="text-sm text-[rgb(var(--foreground-muted))]">{subtitle}</p>
            ) : (
              <p className="text-sm text-[rgb(var(--foreground-muted))]">
                Binance ↔ OKX spread analytics, updated every 2 hours.
              </p>
            )}
          </div>
          <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-[rgba(32,34,58,0.9)] shadow-[0_8px_24px_rgba(120,82,255,0.35)]">
            <motion.div
              initial={{ scale: 0.85, opacity: 0.75 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-xs font-semibold tracking-wider text-[rgb(var(--foreground))]"
            >
              <span>2h</span>
              <span className="text-[10px] font-normal text-[rgb(var(--foreground-muted))]">
                cycle
              </span>
            </motion.div>
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col gap-5 pb-24"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="glass-panel fixed inset-x-0 bottom-5 z-20 mx-auto flex w-[calc(100%-3rem)] max-w-lg items-center justify-around rounded-[26px] px-3 py-2 sm:max-w-2xl">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                  className={clsx(
                    "group relative flex flex-1 items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-[rgba(120,82,255,0.18)] text-white"
                      : "text-[rgb(186,192,225)] hover:bg-white/5"
                  )}
              >
                <Icon
                  size={22}
                  className={clsx(
                      "transition-transform",
                      active ? "scale-100 text-[rgb(120,82,255)]" : "scale-95 text-[rgb(186,192,225)]"
                  )}
                />
                <span className="hidden text-xs sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
