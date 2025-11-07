"use client";

import {ChangeEvent} from "react";
import {useTranslations} from "next-intl";

import {usePathname, useRouter} from "@/i18n/routing";
import {Locale, localeLabels, locales} from "@/util/i18n";

export function LocaleSwitcher({currentLocale}: {currentLocale: Locale}) {
  const router = useRouter();
  const pathname = usePathname();
  const tCommon = useTranslations("common");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <label className="flex items-center gap-2 text-xs text-slate-200/80">
      <span>{tCommon("language")}:</span>
      <select
        className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur"
        value={currentLocale}
        onChange={handleChange}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} className="bg-slate-900 text-slate-50">
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
