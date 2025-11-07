import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { Providers } from "@/components/providers";
import { locales, type AppLocale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: AppLocale };
}) {
  const { locale } = params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} data-locale={locale}>
      <body className="mx-auto flex min-h-screen w-full justify-center">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex w-full max-w-[480px] flex-1 flex-col px-4 pb-24 pt-6 md:max-w-[540px] lg:max-w-[600px]">
              {children}
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
