import {ReactNode} from "react";
import {redirect} from "next/navigation";

import {DashboardShell} from "@/components/dashboard/dashboard-shell";
import {getServerAuthSession} from "@/lib/auth";
import {Locale, defaultLocale, locales} from "@/util/i18n";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardLayout({children, params}: DashboardLayoutProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  return (
    <DashboardShell locale={normalizedLocale} userEmail={session.user.email}>
      {children}
    </DashboardShell>
  );
}
