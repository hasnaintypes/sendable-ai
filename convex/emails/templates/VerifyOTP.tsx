import { Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface VerifyOTPProps {
    code: string;
}

export const VerifyOTP = ({ code }: VerifyOTPProps) => {
    return (
        <BaseLayout preview={`Your verification code is ${code}`}>
            <Heading style={h1}>Verification code</Heading>
            <Text style={text}>
                Use the code below to verify your identity. This code is
                valid for <strong>10 minutes</strong>.
            </Text>
            <Section style={codeContainer}>
                <Text style={codeText}>{code}</Text>
            </Section>
            <Text style={hint}>
                Enter this code in the verification screen to continue.
                Do not share this code with anyone.
            </Text>
            <Text style={disclaimer}>
                If you didn&apos;t request this code, someone may be trying to
                access your account. You can safely ignore this email, but
                consider changing your password.
            </Text>
        </BaseLayout>
    );
};

export default VerifyOTP;

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

const codeContainer = {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center" as const,
    margin: "0 0 24px",
    border: "1px solid #e2e8f0",
};

const codeText = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: "8px",
    margin: "0",
    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
};

const hint = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0 0 24px",
};

const disclaimer = {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
};
