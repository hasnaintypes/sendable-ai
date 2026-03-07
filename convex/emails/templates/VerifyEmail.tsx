import { Button, Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface VerifyEmailProps {
    url: string;
}

export const VerifyEmail = ({ url }: VerifyEmailProps) => {
    return (
        <BaseLayout preview="Verify your email address to get started with Sendable">
            <Heading style={h1}>Welcome to Sendable</Heading>
            <Text style={text}>
                Thanks for signing up! Please verify your email address to activate
                your account and start creating personalized outreach campaigns.
            </Text>
            <Section style={btnContainer}>
                <Button style={button} href={url}>
                    Verify email address
                </Button>
            </Section>
            <Text style={hint}>
                This link expires in 24 hours. If the button above doesn&apos;t work,
                copy and paste this URL into your browser:
            </Text>
            <Text style={urlText}>{url}</Text>
            <Text style={disclaimer}>
                If you didn&apos;t create an account with Sendable, you can safely ignore
                this email.
            </Text>
        </BaseLayout>
    );
};

export default VerifyEmail;

const h1 = {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 16px",
    letterSpacing: "-0.3px",
};

const text = {
    color: "#334155",
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 24px",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const button = {
    backgroundColor: "#7c3aed",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
    letterSpacing: "-0.2px",
};

const hint = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 8px",
};

const urlText = {
    color: "#7c3aed",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 24px",
    wordBreak: "break-all" as const,
};

const disclaimer = {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
};
