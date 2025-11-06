import { en } from "@/i18n/locales/en";
import { tr } from "@/i18n/locales/tr";

export const locales = {
  en,
  tr,
};

export type Locale = keyof typeof locales;

export const fallbackLocale: Locale = "en";

export const isSupportedLocale = (value?: string | null): value is Locale =>
  !!value && Object.hasOwn(locales, value as Locale);

export const getDictionary = (locale?: string | null) =>
  locales[isSupportedLocale(locale) ? locale : fallbackLocale];
