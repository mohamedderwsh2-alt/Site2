import {createNavigation} from "next-intl/navigation";

import {Locale, defaultLocale, localePrefix, locales} from "@/util/i18n";

export const pathnames = {
  "/": "/",
  "/auth/login": "/auth/login",
  "/auth/register": "/auth/register",
  "/dashboard": "/dashboard",
  "/dashboard/deposit": "/dashboard/deposit",
  "/dashboard/withdraw": "/dashboard/withdraw",
  "/dashboard/referrals": "/dashboard/referrals",
  "/dashboard/articles": "/dashboard/articles",
  "/dashboard/support": "/dashboard/support",
} as const;

export const {Link, redirect, usePathname, useRouter} = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});
