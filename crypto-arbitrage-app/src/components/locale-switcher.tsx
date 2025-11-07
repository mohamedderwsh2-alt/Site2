"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppLocale, localeNames, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

function replaceLocale(pathname: string, locale: AppLocale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as AppLocale)) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }
  return segments.join("/") || `/${locale}`;
}

export function LocaleSwitcher({
  align = "right",
}: {
  align?: "left" | "right";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLocale = locales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  ) as AppLocale | undefined;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white",
        align === "left" ? "self-start" : "self-end"
      )}
    >
      <span className="uppercase tracking-wide text-slate-200">
        {localeNames[currentLocale ?? "en"]}
      </span>
      <select
        className="bg-transparent text-xs font-semibold uppercase tracking-wide outline-none"
        value={currentLocale ?? "en"}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;
          const nextPath = replaceLocale(pathname, nextLocale);
          startTransition(() => {
            router.push(nextPath);
          });
        }}
        disabled={isPending}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} className="bg-slate-900">
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
