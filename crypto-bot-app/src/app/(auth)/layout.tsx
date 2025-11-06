import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { fallbackLocale, getDictionary, isSupportedLocale, type Locale } from "@/i18n";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale: Locale = isSupportedLocale(cookieLocale) ? (cookieLocale as Locale) : fallbackLocale;
  const dictionary = getDictionary(locale);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.25),_transparent_55%)]" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl lg:flex-row">
        <section className="flex flex-1 flex-col justify-between rounded-2xl bg-white/5 px-6 py-10 text-slate-100 shadow-inner">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                FluxArb
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight">
                {dictionary.common.appName}
              </h1>
              <p className="mt-3 max-w-sm text-sm text-slate-200/80">
                {dictionary.common.appTagline}
              </p>
            </div>
            <LanguageSwitcher compact className="bg-white/10" />
          </div>
          <div className="mt-12 space-y-4 text-sm text-slate-200/80">
            <p>• {dictionary.trade.strategy.points[0]}</p>
            <p>• {dictionary.trade.strategy.points[1]}</p>
            <p>• {dictionary.trade.strategy.points[2]}</p>
            <p>• {dictionary.trade.strategy.points[3]}</p>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-200">
            <p className="font-medium text-indigo-300">{dictionary.wallet.fixedAddressNote}</p>
            <p className="mt-2 text-xs text-slate-400">
              {dictionary.learn.subtitle}
            </p>
          </div>
        </section>
        <section className="flex flex-1 flex-col justify-center rounded-2xl bg-slate-900/70 px-6 py-8 shadow-lg">
          {children}
        </section>
      </div>
    </div>
  );
}
