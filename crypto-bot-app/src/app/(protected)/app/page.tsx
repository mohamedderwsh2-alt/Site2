import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import OverviewView from "@/components/dashboard/OverviewView";
import { authOptions } from "@/lib/auth";
import { loadOverview } from "@/lib/services/overview";

export default async function AppHomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await loadOverview(session.user.id);

  return <OverviewView data={overview} />;
}
