import {format} from "date-fns";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {DepositForm} from "@/app/[locale]/dashboard/deposit/_components/deposit-form";
import {CopyButton} from "@/components/copy-button";
import {Link} from "@/i18n/routing";
import {getServerAuthSession} from "@/lib/auth";
import {fetchDashboardData} from "@/lib/user";
import {Locale, defaultLocale, locales} from "@/util/i18n";
import {TELEGRAM_SUPPORT_URL, USDT_WALLET_ADDRESS} from "@/util/env";

type DepositPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DepositPage({params}: DepositPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const data = await fetchDashboardData(session.user.id);

  const [tWallet, tStatus, tCommon] = await Promise.all([
    getTranslations("wallet"),
    getTranslations("status"),
    getTranslations("common"),
  ]);

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tWallet("depositTitle")}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{USDT_WALLET_ADDRESS}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CopyButton text={USDT_WALLET_ADDRESS} label={tWallet("copy")} copiedLabel={tCommon("copied")} />
          <Link
            href="/dashboard/support"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-xs font-medium text-white transition hover:border-white/40"
          >
            Telegram
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-200/70">{tWallet("depositSubtitle")}</p>
        <p className="mt-2 text-xs text-slate-200/50">{tWallet("depositNote")}</p>
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <h2 className="text-lg font-semibold text-white">{tWallet("depositFormTitle")}</h2>
        <p className="mt-2 text-sm text-slate-200/70">
          {tWallet("depositNote")}{" "}
          <a href={TELEGRAM_SUPPORT_URL} className="text-sky-300 hover:text-sky-200">
            Telegram
          </a>
        </p>
        <div className="mt-6">
          <DepositForm locale={normalizedLocale} />
        </div>
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{tWallet("history.deposits")}</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-200/50">
            {data?.history.deposits.length ?? 0}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {data && data.history.deposits.length > 0 ? (
            data.history.deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">
                    {deposit.amount.toLocaleString(normalizedLocale, {minimumFractionDigits: 2})} USDT
                  </p>
                  <p className="text-xs text-slate-200/50">{format(new Date(deposit.createdAt), "MMM d · HH:mm")}</p>
                  {deposit.reference ? (
                    <p className="text-xs text-slate-200/60">Ref: {deposit.reference}</p>
                  ) : null}
                </div>
                <span className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-xs uppercase tracking-[0.3em] text-white/80">
                  {tStatus(
                    deposit.status === "PENDING"
                      ? "awaiting"
                      : deposit.status === "COMPLETED"
                        ? "completed"
                        : "cancelled",
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200/60">
              {tWallet("history.empty")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
