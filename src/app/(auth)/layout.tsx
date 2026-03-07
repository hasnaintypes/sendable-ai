import { isAuthenticated, preloadAuthQuery } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { api } from "@/convex/_generated/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Sendable",
  description:
    "Manage your cold email outreach campaigns with AI-powered automation",
};

export default async function Layout({ children }: PropsWithChildren) {
  if (!(await isAuthenticated())) {
    redirect("/sign-in");
  }

  const preloadedUserQuery = await preloadAuthQuery(
    api.auth.queries.getCurrentUser,
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader preloadedUserQuery={preloadedUserQuery} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
