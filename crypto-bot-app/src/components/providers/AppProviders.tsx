"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { TranslationProvider } from "@/i18n/TranslationProvider";
import type { Locale } from "@/i18n";

interface AppProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  initialLocale: Locale;
}

export const AppProviders = ({ children, session, initialLocale }: AppProvidersProps) => (
  <SessionProvider session={session}>
    <TranslationProvider
      initialLocale={initialLocale}
      sessionLocale={session?.user?.language as Locale | undefined}
      persistPreference={Boolean(session?.user)}
    >
      {children}
    </TranslationProvider>
  </SessionProvider>
);

export default AppProviders;
