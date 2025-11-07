import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";

import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArbiPulse | Crypto Arbitrage Bot Marketplace",
  description:
    "Experience a mobile-native e-commerce platform for purchasing Binance ↔ OKX arbitrage bots, tracking trades, and managing USDT cash flow.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
