import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeamPlatform - Sports Team Management Made Simple",
  description: "The all-in-one platform for sports teams. Manage your team website, events, roster, registrations, and communications in one place.",
  keywords: "sports team management, team website, swim team, event management, roster management",
  openGraph: {
    title: "TeamPlatform - Sports Team Management Made Simple",
    description: "The all-in-one platform for sports teams. Manage your team website, events, roster, registrations, and communications in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
