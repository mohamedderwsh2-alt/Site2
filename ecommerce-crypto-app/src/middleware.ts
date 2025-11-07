import createMiddleware from "next-intl/middleware";

import {defaultLocale, locales, localePrefix} from "@/util/i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
