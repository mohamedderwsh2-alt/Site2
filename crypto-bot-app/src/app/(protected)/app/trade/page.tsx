import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import TradeView from "@/components/dashboard/TradeView";
import { authOptions } from "@/lib/auth";
import { loadOverview } from "@/lib/services/overview";

export default async function TradePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await loadOverview(session.user.id);

  return <TradeView data={overview} />;
}
