import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { authOptions } from "@/server/auth/options";

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    redirect(`/${params.locale}/login`);
  }

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <div className="flex-1">{children}</div>
      <BottomNav />
    </div>
  );
}
