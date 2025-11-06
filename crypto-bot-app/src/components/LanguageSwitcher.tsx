"use client";

import { useTransition } from "react";
import { Globe2 } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { useTranslation } from "@/i18n/TranslationProvider";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

const languageEntries = Object.entries(locales) as Array<[Locale, (typeof locales)[Locale]]>;

export const LanguageSwitcher = ({ className = "", compact = false }: LanguageSwitcherProps) => {
  const { locale, setLocale, dictionary } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: Locale) => {
    startTransition(() => setLocale(value));
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => handleChange(locale === "en" ? "tr" : "en")}
        className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 ${className}`}
      >
        <Globe2 className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 ${className}`}
    >
      <Globe2 className="h-4 w-4 text-indigo-300" />
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as Locale)}
        className="bg-transparent text-sm font-medium uppercase text-slate-100 outline-none"
      >
        {languageEntries.map(([value]) => (
          <option key={value} value={value} className="text-slate-900">
            {value === "en" ? dictionary.language.english : dictionary.language.turkish}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
