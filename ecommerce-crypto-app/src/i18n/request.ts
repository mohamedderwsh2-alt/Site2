import {getRequestConfig} from "next-intl/server";

import {Locale, locales} from "@/util/i18n";

export default getRequestConfig(async ({locale}) => {
  const normalizedLocale = locale as Locale;

  if (!locales.includes(normalizedLocale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return {
    locale: normalizedLocale,
    messages: (await import(`@/messages/${normalizedLocale}.json`)).default,
  };
});
