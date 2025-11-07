import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  matcher: ["/", "/(en|es|tr)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
