import { Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import BaseLayout from "./BaseLayout";

interface AlertEmailProps {
    title: string;
    message: string;
}

export const AlertEmail = ({ title, message }: AlertEmailProps) => {
    return (
        <BaseLayout preview={title}>
            <Heading style={h1}>{title}</Heading>
            <Section style={alertBox}>
                <Text style={alertText}>{message}</Text>
            </Section>
            <Text style={hint}>
                This is an automated security alert from your Sendable account.
                If you have questions, please contact our support team.
            </Text>
        </BaseLayout>
    );
};

export default AlertEmail;

const h1 = {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 16px",
    letterSpacing: "-0.3px",
};

const alertBox = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "20px",
    margin: "0 0 24px",
};

const alertText = {
    color: "#991b1b",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
};

const hint = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: "0",
};
