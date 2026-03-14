import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartClaim Pro",
  description:
    "Hackathon-ready specialty insurance dashboard for policy operations, claims triage, customer visibility, and broker workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
