import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { generateReferralCode, sanitizeReferralCode } from "@/lib/referral";

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(60),
    language: z.string().default("en").optional(),
    referralCode: z.string().optional(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, language, referralCode } = registerSchema.parse(body);

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "email_in_use" }, { status: 400 });
    }

    let uniqueReferral: string | null = null;

    while (!uniqueReferral) {
      const codeCandidate = generateReferralCode();
      const codeExists = await prisma.user.findUnique({
        where: { referralCode: codeCandidate },
        select: { id: true },
      });

      if (!codeExists) {
        uniqueReferral = codeCandidate;
      }
    }

    let referredById: string | undefined;

    const sanitizedReferral = sanitizeReferralCode(referralCode);

    if (sanitizedReferral) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: sanitizedReferral },
        select: { id: true },
      });

      if (!referrer) {
        return NextResponse.json({ error: "invalid_referral" }, { status: 400 });
      }

      referredById = referrer.id;
    }

    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name,
        language: language ?? "en",
        referralCode: uniqueReferral,
        referredById,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      referralCode: user.referralCode,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "validation_error", issues: error.flatten() }, { status: 400 });
    }

    console.error("Registration error", error);
    return NextResponse.json({ error: "registration_failed" }, { status: 500 });
  }
}
