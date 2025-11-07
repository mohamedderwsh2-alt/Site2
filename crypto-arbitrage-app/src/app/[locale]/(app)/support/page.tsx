import { getTranslations } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/server/queries/dashboard";

export default async function SupportPage({ params }: { params: { locale: string } }) {
  const support = await getTranslations({
    locale: params.locale,
    namespace: "support",
  });
  const articles = await getArticles();

  return (
    <main className="flex flex-col gap-6 pb-6">
      <Card className="bg-gradient-to-br from-sky-500/20 via-sky-500/10 to-purple-500/10">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" />
          {support("title")}
        </CardTitle>
        <CardDescription className="mt-3 text-sm text-slate-200">
          {support("articlesIntro")}
        </CardDescription>
        <Link
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-sky-100 transition hover:bg-white/20"
        >
          {support("telegramCta")}
        </Link>
      </Card>

      <section className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit text-slate-300">
          {support("knowledgeBase")}
        </Badge>
        <div className="flex flex-col gap-3">
          {articles.map((article) => (
            <Card key={article.slug} className="bg-white/5">
              <CardTitle className="text-white">{article.title}</CardTitle>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm text-slate-200">
                {article.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
