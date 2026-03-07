import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { getToken } from "@/lib/auth/server";
import { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sendable - AI-Powered Email Outreach Platform",
  description:
    "Generate personalized cold emails with AI. Automate research, personalization, and follow-ups for sales, recruiting, and networking.",
  icons: {
    icon: "/icons/sendable-logo.png",
  },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const token = await getToken();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ConvexClientProvider initialToken={token}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider> 
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
