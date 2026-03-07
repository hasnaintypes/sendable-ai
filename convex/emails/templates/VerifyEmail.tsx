import { Button, Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface VerifyEmailProps {
    url: string;
}

export const VerifyEmail = ({ url }: VerifyEmailProps) => {
    return (
        <BaseLayout preview="Verify your email address for Sendable AI">
            <Heading style={h1}>Welcome to Sendable AI!</Heading>
            <Text style={text}>
                We're excited to have you on board. To get started, please verify your
                email address by clicking the button below:
            </Text>
            <Section style={btnContainer}>
                <Button style={button} href={url}>
                    Verify Email address
                </Button>
            </Section>
            <Text style={text}>
                If you didn't create an account with us, you can safely ignore this
                email.
            </Text>
        </BaseLayout>
    );
};

export default VerifyEmail;

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
