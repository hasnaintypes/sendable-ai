import { Button, Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface ResetPasswordProps {
    url: string;
}

export const ResetPassword = ({ url }: ResetPasswordProps) => {
    return (
        <BaseLayout preview="Reset your Sendable AI password">
            <Heading style={h1}>Password Reset Request</Heading>
            <Text style={text}>
                We received a request to reset your password for your Sendable AI
                account. Click the button below to choose a new password:
            </Text>
            <Section style={btnContainer}>
                <Button style={button} href={url}>
                    Reset Password
                </Button>
            </Section>
            <Text style={text}>
                If you didn't request a password reset, you can safely ignore this
                email. This link will expire in 1 hour.
            </Text>
        </BaseLayout>
    );
};

export default ResetPassword;

const h1 = {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "16px",
};

const text = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "24px",
};

const btnContainer = {
    textAlign: "center" as const,
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#7c3aed",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "16px 32px",
};
