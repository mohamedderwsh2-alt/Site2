import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <main className="flex flex-1 flex-col gap-6">
      <Link href="/login">
        <Button variant="ghost" className="gap-2 px-0 text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          {t("haveAccount")}
        </Button>
      </Link>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">
          {t("createAccount")}
        </h1>
        <p className="text-sm text-slate-300">{t("registerSubtitle")}</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-slate-300">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-sky-300">
          {t("login")}
        </Link>
      </p>
    </main>
  );
}
