import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || "SaaS Kit",
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "SaaS Kit"}`,
  },
  description:
    "Ship your SaaS faster with production-ready Next.js, Supabase, Stripe, and Coolify deployment.",
  keywords: ["SaaS", "Next.js", "Supabase", "Stripe", "Coolify", "boilerplate"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
