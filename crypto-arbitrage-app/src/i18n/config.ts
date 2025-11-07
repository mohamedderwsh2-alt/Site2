export const locales = ["en", "es", "tr"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  es: "Español",
  tr: "Türkçe",
};
