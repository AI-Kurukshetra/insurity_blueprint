import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartClaim Pro",
  description:
    "Hackathon-ready specialty insurance dashboard for policy operations, claims triage, customer visibility, and broker workflows.",
};

const themeScript = `
  (function() {
    var storageKey = "smartclaim-theme";
    var savedTheme = null;
    try {
      savedTheme = window.localStorage.getItem(storageKey);
    } catch (error) {
      savedTheme = null;
    }
    var theme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
