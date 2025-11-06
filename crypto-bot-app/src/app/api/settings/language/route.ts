import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { locales } from "@/i18n";

const localeKeys = Object.keys(locales) as Array<keyof typeof locales>;

const languageSchema = z.object({
  language: z.enum(localeKeys as [string, ...string[]]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const { language } = languageSchema.parse(payload);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { language },
  });

  const response = NextResponse.json({ success: true, language });
  response.cookies.set("locale", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
