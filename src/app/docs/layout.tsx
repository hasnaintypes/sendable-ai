import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./docs.css";
import type { ReactNode } from "react";
import Image from "next/image";

export const metadata = {
  title: {
    default: "Sendable Docs",
    template: "%s — Sendable Docs",
  },
};

const logo = (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <Image
      src="/icons/sendable-logo.png"
      alt="Sendable"
      width={28}
      height={28}
      style={{ borderRadius: 6 }}
    />
    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Sendable</span>
  </div>
);

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap("/docs");

  return (
    <Layout
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/your-org/sendable-ai/tree/main/content"
      navbar={
        <Navbar
          logo={logo}
          projectLink="https://github.com/your-org/sendable-ai"
        />
      }
      footer={<Footer />}
    >
      {children}
    </Layout>
  );
}
