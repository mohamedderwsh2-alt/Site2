import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LearnView from "@/components/dashboard/LearnView";
import { authOptions } from "@/lib/auth";
import { loadOverview } from "@/lib/services/overview";

export default async function LearnPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await loadOverview(session.user.id);

  return <LearnView data={overview} />;
}
