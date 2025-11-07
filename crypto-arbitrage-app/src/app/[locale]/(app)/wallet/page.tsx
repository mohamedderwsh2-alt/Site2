import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { WalletTabs } from "@/components/wallet/wallet-tabs";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";

export default async function WalletPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { tab?: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    redirect(`/${params.locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      walletBalance: true,
      botPrincipal: true,
      totalDeposited: true,
      totalWithdrawn: true,
      totalEarnings: true,
    },
  });

  if (!user) {
    redirect(`/${params.locale}/login`);
  }

  const transactions = await prisma.walletTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const defaultTab =
    searchParams.tab === "withdraw" ? "withdraw" : ("deposit" as const);

  const centralAddress =
    process.env.CENTRAL_USDT_ADDRESS ?? "USDT-ADDRESS-NOT-CONFIGURED";
  type TransactionRow = (typeof transactions)[number];

  return (
    <main className="flex flex-col gap-6 pb-6">
      <WalletTabs
        defaultTab={defaultTab}
        centralAddress={centralAddress}
        balance={Number(user.walletBalance)}
        principal={Number(user.botPrincipal)}
        totalDeposited={Number(user.totalDeposited)}
        totalWithdrawn={Number(user.totalWithdrawn)}
        totalEarnings={Number(user.totalEarnings)}
        transactions={transactions.map((tx: TransactionRow) => ({
          id: tx.id,
          type: tx.type,
          status: tx.status,
          amount: Number(tx.amount),
          createdAt: tx.createdAt.toISOString(),
          note: tx.note,
        }))}
      />
    </main>
  );
}
