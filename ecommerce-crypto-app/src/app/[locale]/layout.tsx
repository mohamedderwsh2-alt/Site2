import {ReactNode} from "react";
import {getMessages} from "next-intl/server";
import {notFound} from "next/navigation";

import {AppProviders} from "@/components/providers/app-providers";
import {Locale, locales} from "@/util/i18n";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <AppProviders locale={locale} messages={messages}>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {children}
      </div>
    </AppProviders>
  );
}
