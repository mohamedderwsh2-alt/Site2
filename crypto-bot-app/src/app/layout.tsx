import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import AppProviders from "@/components/providers/AppProviders";
import { authOptions } from "@/lib/auth";
import { fallbackLocale, isSupportedLocale, type Locale } from "@/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluxArb Mobile",
  description: "Mobile-first e-commerce experience for the FluxArb trading bot",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const sessionLocale = session?.user?.language;

  const initialLocale: Locale = isSupportedLocale(sessionLocale)
    ? (sessionLocale as Locale)
    : isSupportedLocale(cookieLocale)
      ? (cookieLocale as Locale)
      : fallbackLocale;

  return (
    <html lang={initialLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <AppProviders session={session} initialLocale={initialLocale}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
