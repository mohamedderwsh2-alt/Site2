import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import ProfileView from "@/components/dashboard/ProfileView";
import { authOptions } from "@/lib/auth";
import { loadOverview } from "@/lib/services/overview";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const overview = await loadOverview(session.user.id);

  return <ProfileView data={overview} />;
}
