import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {compare} from "bcryptjs";
import type {NextAuthOptions} from "next-auth";
import {getServerSession} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {z} from "zod";

import {prisma} from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const {email, password} = parsed.data;
        const user = await prisma.user.findUnique({
          where: {email},
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          locale: user.locale,
        };
      },
      credentials: {
        email: {label: "Email", type: "email", placeholder: "you@example.com"},
        password: {label: "Password", type: "password"},
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    locale: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
