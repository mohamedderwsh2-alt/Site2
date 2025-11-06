import "dotenv/config";
import crypto from "node:crypto";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "admin@fluxarb.app";
const DEFAULT_ADMIN_PASSWORD = "Admin12345!";

const createReferralCode = () => `CB${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL).toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin user already exists for ${email}`);
    return;
  }

  let referralCode = createReferralCode();

  // ensure uniqueness
  while (
    await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true },
    })
  ) {
    referralCode = createReferralCode();
  }

  const passwordHash = await hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: "FluxArb Admin",
      language: "en",
      role: UserRole.ADMIN,
      referralCode,
    },
  });

  console.log(`✔️  Admin user created. Email: ${email} Password: ${password}`);
}

main()
  .catch((error) => {
    console.error("Seed error", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
