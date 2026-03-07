import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Font,
    Img,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
    preview: string;
    children: React.ReactNode;
}

export const BaseLayout = ({ preview, children }: BaseLayoutProps) => {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Helvetica"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2",
                        format: "woff2",
                    }}
                    fontWeight={600}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logoText}>Sendable</Text>
                    </Section>

                    <Section style={content}>
                        {children}
                    </Section>

                    <Hr style={divider} />

                    <Section style={footer}>
                        <Text style={footerPrimary}>
                            Sendable - AI-Powered Email Outreach
                        </Text>
                        <Text style={footerSecondary}>
                            You received this email because you have an account with Sendable.
                            If you didn&apos;t expect this, you can safely ignore it.
                        </Text>
                        <Text style={footerCopyright}>
                            &copy; {new Date().getFullYear()} Sendable. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BaseLayout;

const main = {
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "40px auto",
    borderRadius: "16px",
    overflow: "hidden" as const,
    maxWidth: "560px",
    border: "1px solid #e2e8f0",
};

const header = {
    padding: "32px 40px 24px",
    borderBottom: "1px solid #f1f5f9",
};

const logoText = {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#7c3aed",
    margin: "0",
    textDecoration: "none",
};

const content = {
    padding: "32px 40px",
};

const divider = {
    borderColor: "#f1f5f9",
    margin: "0",
};

const footer = {
    padding: "24px 40px 32px",
    backgroundColor: "#fafbfc",
};

const footerPrimary = {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "600",
    lineHeight: "1.4",
    margin: "0 0 8px",
};

const footerSecondary = {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 12px",
};

const footerCopyright = {
    color: "#cbd5e1",
    fontSize: "11px",
    lineHeight: "1.4",
    margin: "0",
};
