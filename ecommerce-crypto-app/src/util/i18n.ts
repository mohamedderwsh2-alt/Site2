export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localePrefix = "always";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};
