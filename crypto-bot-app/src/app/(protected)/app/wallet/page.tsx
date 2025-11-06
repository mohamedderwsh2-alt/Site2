import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import WalletView from "@/components/dashboard/WalletView";
import { authOptions } from "@/lib/auth";
import { loadOverview } from "@/lib/services/overview";

export default async function WalletPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await loadOverview(session.user.id);

  return <WalletView data={overview} />;
}
