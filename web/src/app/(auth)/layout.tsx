import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | ArbiterX",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(146,102,255,0.25),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(67,201,132,0.18),transparent_72%)]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
}
