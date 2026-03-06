import { Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface VerifyOTPProps {
    code: string;
}

export const VerifyOTP = ({ code }: VerifyOTPProps) => {
    return (
        <BaseLayout preview="Your verification code for Sendable AI">
            <Heading style={h1}>Verification Code</Heading>
            <Text style={text}>
                Please use the following code to verify your account. This code is
                valid for 10 minutes.
            </Text>
            <Section style={otpBox}>
                <Text style={otpText}>{code}</Text>
            </Section>
            <Text style={text}>
                If you didn't request this code, you can safely ignore this email.
            </Text>
        </BaseLayout>
    );
};

export default VerifyOTP;

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

const otpBox = {
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center" as const,
    marginBottom: "32px",
};

const otpText = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: "8px",
    margin: "0",
};
