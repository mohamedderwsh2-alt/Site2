import {Locale} from "@/util/i18n";

import {LoginScreen} from "./_components/login-screen";

type LoginPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function LoginPage({params}: LoginPageProps) {
  const {locale} = await params;
  return <LoginScreen locale={locale as Locale} />;
}
