export type VerificationMethod = "totp" | "otp" | "backup";

export interface Session {
  id: string;
  token: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
