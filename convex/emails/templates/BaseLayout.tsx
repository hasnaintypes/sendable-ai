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
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logoSection}>
                        <Text style={logoText}>Sendable AI</Text>
                    </Section>
                    <Section style={contentSection}>
                        {children}
                    </Section>
                    <Hr style={hr} />
                    <Section style={footerSection}>
                        <Text style={footerText}>
                            Sent by Sendable AI • Innovations in AI Workflow
                        </Text>
                        <Text style={footerText}>
                            © 2026 Sendable AI. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BaseLayout;

const main = {
    backgroundColor: "#f4f7f9",
    color: "#1a1a1a",
    fontFamily: "'Roboto', sans-serif",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "40px auto",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    maxWidth: "600px",
};

const logoSection = {
    marginBottom: "32px",
    textAlign: "center" as const,
};

const logoText = {
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#7c3aed", // Premium Violet
    margin: "0",
};

const contentSection = {
    marginBottom: "32px",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const footerSection = {
    textAlign: "center" as const,
};

const footerText = {
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "4px 0",
};
