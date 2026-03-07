import { ConvexClientProvider } from "../components/providers/ConvexClientProvider";
import { getToken } from "@/lib/auth/server";
import { PropsWithChildren } from "react";
import { Manrope } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Sendable.ai - AI-Powered Email Outreach Platform",
  description:
    "Generate personalized cold emails with AI. Automate research, personalization, and follow-ups for sales, recruiting, and networking.",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const token = await getToken();
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ConvexClientProvider initialToken={token}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
