import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {getServerAuthSession} from "@/lib/auth";
import {Locale, defaultLocale, locales} from "@/util/i18n";
import {TELEGRAM_SUPPORT_URL} from "@/util/env";

type SupportPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SupportPage({params}: SupportPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const tSupport = await getTranslations("support");

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl md:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tSupport("title")}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{tSupport("subtitle")}</h1>
        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-6 inline-flex h-12 items-center justify-center rounded-full bg-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          {tSupport("cta")}
        </a>
      </section>
    </div>
  );
}
