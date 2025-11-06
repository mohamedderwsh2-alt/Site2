"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Locale } from "@/i18n";
import { fallbackLocale, getDictionary, isSupportedLocale } from "@/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

interface TranslationContextValue {
  locale: Locale;
  dictionary: Dictionary;
  t: (path: string, fallback?: string) => string;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
  sessionLocale?: Locale;
  persistPreference?: boolean;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

const buildCookie = (locale: Locale) =>
  `locale=${locale};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;

const setLocaleCookie = (locale: Locale) => {
  if (typeof document === "undefined") return;
  document.cookie = buildCookie(locale);
};

export const TranslationProvider = ({
  children,
  initialLocale = fallbackLocale,
  sessionLocale,
  persistPreference = true,
}: TranslationProviderProps) => {
  const defaultLocale = sessionLocale ?? initialLocale ?? fallbackLocale;
  const safeLocale = isSupportedLocale(defaultLocale) ? defaultLocale : fallbackLocale;
  const [locale, setLocaleState] = useState<Locale>(safeLocale);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (!isSupportedLocale(nextLocale) || nextLocale === locale) return;
      setLocaleState(nextLocale);

      if (persistPreference) {
        setLocaleCookie(nextLocale);

        fetch("/api/settings/language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: nextLocale }),
        }).catch(() => {
          /* ignore */
        });
      }
    },
    [locale, persistPreference],
  );
    const translate = useCallback(
      (path: string, fallback?: string) => {
        const segments = path.split(".");
        let value: unknown = dictionary;

        for (const segment of segments) {
          if (typeof value === "object" && value !== null && segment in value) {
            value = (value as Record<string, unknown>)[segment];
          } else {
            return fallback ?? path;
          }
        }

        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
        return fallback ?? path;
      },
      [dictionary],
    );

    const contextValue = useMemo(
      () => ({
        locale,
        dictionary,
        t: translate,
        setLocale,
      }),
      [locale, dictionary, translate, setLocale],
    );

  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};
