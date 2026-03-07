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
                <Text style={text}>{message}</Text>
            </Section>
            <Text style={footerText}>
                If you have any questions, please contact our support team.
            </Text>
        </BaseLayout>
    );
};

export default AlertEmail;

const h1 = {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.2",
    marginBottom: "24px",
};

const alertBox = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fee2e2",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
};

const text = {
    color: "#b91c1c",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0",
};

const footerText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    marginTop: "24px",
};
