import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/server/db";
import { generateUniqueReferralCode } from "@/server/services/referrals";

const registerSchema = z
  .object({
    name: z.string().min(2).max(64),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    referralCode: z.string().trim().optional(),
    locale: z.string().default("en"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, email, password, referralCode, locale } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Email is already registered",
      },
      { status: 409 }
    );
  }

  const hashedPassword = await hash(password, 12);
  const uniqueCode = await generateUniqueReferralCode();

  let referredById: string | undefined;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
      select: { id: true },
    });
    referredById = referrer?.id;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      referralCode: uniqueCode,
      language: locale,
      referredById,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Account created successfully",
    },
    { status: 201 }
  );
}
