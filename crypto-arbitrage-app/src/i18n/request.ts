import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales } from "@/i18n/config";

export default getRequestConfig(async ({ locale }) => {
  const activeLocale = (locale ?? defaultLocale) as (typeof locales)[number];
  if (!locales.includes(activeLocale)) {
    throw new Error(`Unsupported locale: ${activeLocale}`);
  }

  return {
    locale: activeLocale,
    messages: (await import(`@/i18n/messages/${activeLocale}.json`)).default,
  };
});
