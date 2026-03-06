import { Button, Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface MagicLinkProps {
    url: string;
}

export const MagicLink = ({ url }: MagicLinkProps) => {
    return (
        <BaseLayout preview="Sign in to Sendable AI">
            <Heading style={h1}>Sign in to your account</Heading>
            <Text style={text}>
                Click the link below to securely sign in to your Sendable AI account.
                This link is only valid for a one-time use.
            </Text>
            <Section style={btnContainer}>
                <Button style={button} href={url}>
                    Sign in Now
                </Button>
            </Section>
            <Text style={text}>
                If you didn't request this sign-in link, you can safely ignore this
                email.
            </Text>
        </BaseLayout>
    );
};

export default MagicLink;

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
