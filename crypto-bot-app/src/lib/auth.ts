import { NextAuthOptions, type User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/lib/prisma";

type ExtendedUser = (User | AdapterUser) & {
  role?: string | null;
  language?: string | null;
  referralCode?: string | null;
};

const isExtendedUser = (user?: User | AdapterUser): user is ExtendedUser => {
  if (!user) return false;
  return "role" in user && "language" in user && "referralCode" in user;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        if (isExtendedUser(user)) {
          if (typeof user.role === "string") {
            token.role = user.role;
          }
          if (typeof user.language === "string") {
            token.language = user.language;
          }
          if (typeof user.referralCode === "string") {
            token.referralCode = user.referralCode;
          }
        }
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            id: true,
            role: true,
            language: true,
            referralCode: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.language = dbUser.language;
          token.referralCode = dbUser.referralCode;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role ?? session.user.role ?? "USER";
        session.user.language = token.language ?? session.user.language ?? "en";
        session.user.referralCode = token.referralCode ?? session.user.referralCode ?? "";
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        const authenticatedUser: User = {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: user.role,
          language: user.language,
          referralCode: user.referralCode,
        };

        return authenticatedUser;
      },
    }),
  ],
};

export default authOptions;
