"use client";

import {NextIntlClientProvider} from "next-intl";
import {SessionProvider} from "next-auth/react";
import {ReactNode} from "react";

type AppProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export function AppProviders({children, locale, messages}: AppProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
