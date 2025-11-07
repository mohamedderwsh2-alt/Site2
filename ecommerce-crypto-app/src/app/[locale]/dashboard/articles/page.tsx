import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {profitReferenceTable} from "@/lib/profit";
import {getServerAuthSession} from "@/lib/auth";
import {Locale, defaultLocale, locales} from "@/util/i18n";
import {TELEGRAM_SUPPORT_URL} from "@/util/env";

type ArticlesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ArticlesPage({params}: ArticlesPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const [tSupport, tEarnings] = await Promise.all([getTranslations("support"), getTranslations("earnings")]);

  const articleBody = tSupport.raw("articleHow.body") as string[];

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tSupport("articlesTitle")}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{tSupport("articleHow.title")}</h1>
        <div className="mt-4 space-y-3 text-sm text-slate-200/70">
          {articleBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          {tSupport("cta")}
        </a>
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-lg font-semibold text-white">{tEarnings("title")}</h2>
        <p className="mt-2 text-sm text-slate-200/70">{tEarnings("disclaimer")}</p>
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 rounded-3xl bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-200/60">
            <span>{tEarnings("tableHead.balance")}</span>
            <span className="text-right">{tEarnings("tableHead.profit")}</span>
          </div>
          {profitReferenceTable.map((row) => (
            <div
              key={row.balance}
              className="grid grid-cols-2 rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80"
            >
              <span>{row.balance.toLocaleString(normalizedLocale, {minimumFractionDigits: 2})} USDT</span>
              <span className="text-right text-emerald-300">
                {row.dailyProfit.toLocaleString(normalizedLocale, {minimumFractionDigits: 2})} USDT
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
