import {Locale} from "@/util/i18n";

import {RegisterScreen} from "./_components/register-screen";

type RegisterPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function RegisterPage({params}: RegisterPageProps) {
  const {locale} = await params;
  return <RegisterScreen locale={locale as Locale} />;
}
