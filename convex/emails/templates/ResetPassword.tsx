import { Button, Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface ResetPasswordProps {
    url: string;
}

export const ResetPassword = ({ url }: ResetPasswordProps) => {
    return (
        <BaseLayout preview="Reset your Sendable password">
            <Heading style={h1}>Reset your password</Heading>
            <Text style={text}>
                We received a request to reset the password for your Sendable account.
                Click the button below to choose a new password.
            </Text>
            <Section style={btnContainer}>
                <Button style={button} href={url}>
                    Reset password
                </Button>
            </Section>
            <Section style={infoBox}>
                <Text style={infoText}>
                    This link will expire in <strong>1 hour</strong> for security reasons.
                    If you need a new link, visit the sign-in page and request another reset.
                </Text>
            </Section>
            <Text style={disclaimer}>
                If you didn&apos;t request a password reset, no action is needed.
                Your password will remain unchanged.
            </Text>
        </BaseLayout>
    );
};

export default ResetPassword;

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

const infoBox = {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "16px",
    margin: "0 0 24px",
    border: "1px solid #e2e8f0",
};

const infoText = {
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
};

const disclaimer = {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
};
