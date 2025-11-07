import {format} from "date-fns";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

import {WithdrawForm} from "@/app/[locale]/dashboard/withdraw/_components/withdraw-form";
import {getServerAuthSession} from "@/lib/auth";
import {fetchDashboardData} from "@/lib/user";
import {Locale, defaultLocale, locales} from "@/util/i18n";

type WithdrawPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function WithdrawPage({params}: WithdrawPageProps) {
  const {locale} = await params;
  const normalizedLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect(`/${normalizedLocale}/auth/login`);
  }

  const data = await fetchDashboardData(session.user.id);

  const [tWallet, tStatus] = await Promise.all([getTranslations("wallet"), getTranslations("status")]);

  return (
    <div className="space-y-8 pb-16">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/50">{tWallet("withdrawTitle")}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{tWallet("withdrawSubmit")}</h1>
        <p className="mt-4 text-sm text-slate-200/70">{tWallet("withdrawNote")}</p>
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <WithdrawForm locale={normalizedLocale} />
      </section>

      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{tWallet("history.withdrawals")}</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-200/50">
            {data?.history.withdrawals.length ?? 0}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {data && data.history.withdrawals.length > 0 ? (
            data.history.withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-slate-200/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-white">
                    {withdrawal.amount.toLocaleString(normalizedLocale, {minimumFractionDigits: 2})} USDT
                  </p>
                  <p className="text-xs text-slate-200/50">{format(new Date(withdrawal.createdAt), "MMM d · HH:mm")}</p>
                  <p className="text-xs text-slate-200/60 truncate max-w-xs">{withdrawal.address}</p>
                </div>
                <span className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-xs uppercase tracking-[0.3em] text-white/80">
                  {tStatus(
                    withdrawal.status === "PENDING"
                      ? "awaiting"
                      : withdrawal.status === "COMPLETED"
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
