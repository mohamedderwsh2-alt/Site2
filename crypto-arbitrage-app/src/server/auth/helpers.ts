import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";

import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db";

export async function getCurrentSession() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (await getServerSession(authOptions as any)) as Session | null;
}

export async function getCurrentUser() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}

export async function requireUser() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
