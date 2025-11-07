import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <main className="flex flex-1 flex-col gap-6">
      <Link href="/">
        <Button variant="ghost" className="gap-2 px-0 text-slate-200">
          <ArrowLeft className="h-4 w-4" />
          {t("noAccount")}
        </Button>
      </Link>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">
          {t("welcomeBack")}
        </h1>
        <p className="text-sm text-slate-300">{t("loginSubtitle")}</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-slate-300">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-semibold text-sky-300">
          {t("createAccount")}
        </Link>
      </p>
    </main>
  );
}
