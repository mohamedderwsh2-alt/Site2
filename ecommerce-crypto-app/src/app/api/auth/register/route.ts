import {hash} from "bcryptjs";
import {NextResponse} from "next/server";
import {z} from "zod";

import {prisma} from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
  referralCode: z.string().optional(),
  locale: z.string().optional(),
});

const REFERRAL_CODE_LENGTH = 8;
const REFERRAL_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

async function generateReferralCode() {
  while (true) {
    const code = Array.from({length: REFERRAL_CODE_LENGTH}, () =>
      REFERRAL_CHARSET[Math.floor(Math.random() * REFERRAL_CHARSET.length)],
    ).join("");

    const existing = await prisma.user.findUnique({
      where: {referralCode: code},
      select: {id: true},
    });

    if (!existing) {
      return code;
    }
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({error: "Invalid payload"}, {status: 400});
    }

    const {email, password, name, referralCode, locale} = parsed.data;

    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
      return NextResponse.json({error: "Email already registered"}, {status: 409});
    }

    const hashedPassword = await hash(password, 10);
    const newReferralCode = await generateReferralCode();

    let referredById: string | undefined;
    if (referralCode) {
      const referralOwner = await prisma.user.findUnique({
        where: {referralCode},
        select: {id: true},
      });
      if (referralOwner) {
        referredById = referralOwner.id;
      }
    }

    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        locale: locale ?? "en",
        referralCode: newReferralCode,
        referredById,
      },
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({error: "Unable to register"}, {status: 500});
  }
}
