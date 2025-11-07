 "use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Bot, Home, LifeBuoy, Wallet, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    key: "dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    key: "wallet",
    icon: Wallet,
    href: "/wallet",
  },
  {
    key: "bot",
    icon: Bot,
    href: "/bot",
  },
  {
    key: "referrals",
    icon: Users,
    href: "/referrals",
  },
  {
    key: "support",
    icon: LifeBuoy,
    href: "/support",
  },
] as const;

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="glass flex w-full max-w-[480px] items-center justify-between rounded-[24px] border border-white/10 bg-slate-900/60 px-4 py-3 text-xs text-slate-200 shadow-2xl md:max-w-[540px]">
          {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-[16px] px-2 py-2 transition-colors",
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "drop-shadow-lg")} />
              <span className="text-[11px] font-medium">
                {t(item.key as keyof typeof NAV_ITEMS[number])}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
