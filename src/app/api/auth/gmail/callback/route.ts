// sendable-web/src/app/api/auth/gmail/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCipheriv, randomBytes } from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth/server";

function encryptValue(plaintext: string, keyBase64: string): string {
  const key = Buffer.from(keyBase64, "base64");
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  const settingsBase = `${url.protocol}//${url.host}/settings?tab=integrations`;

  if (errorParam) {
    return NextResponse.redirect(`${settingsBase}&error=oauth_denied`);
  }

  // Validate CSRF state
  const storedState = request.cookies.get("gmail_oauth_state")?.value;
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${settingsBase}&error=invalid_state`);
  }

  if (!code) {
    return NextResponse.redirect(`${settingsBase}&error=connect_failed`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const encryptionKey = process.env.ENCRYPTION_KEY!;
  const redirectUri = `${url.protocol}//${url.host}/api/auth/gmail/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${settingsBase}&error=connect_failed`);
    }

    const tokens = await tokenRes.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
    };

    if (!tokens.refresh_token) {
      // No refresh token means prompt=consent was bypassed — shouldn't happen
      return NextResponse.redirect(`${settingsBase}&error=no_refresh_token`);
    }

    // Get Gmail email address
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    );

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${settingsBase}&error=connect_failed`);
    }

    const userInfo = await userInfoRes.json() as { email: string };

    // Encrypt tokens before storing
    const encryptedAccessToken = encryptValue(tokens.access_token, encryptionKey);
    const encryptedRefreshToken = encryptValue(tokens.refresh_token, encryptionKey);
    const accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;

    // Call Convex mutation with user's session token
    const sessionToken = await getToken();
    if (!sessionToken) {
      return NextResponse.redirect(`${url.protocol}//${url.host}/sign-in`);
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    convex.setAuth(sessionToken);

    await convex.mutation(api.inboxes.mutations.storeGmailInbox, {
      encryptedAccessToken,
      encryptedRefreshToken,
      accessTokenExpiresAt,
      email: userInfo.email,
      scopes: tokens.scope,
    });

    const response = NextResponse.redirect(`${settingsBase}&connected=true`);
    // Clear the CSRF cookie
    response.cookies.set("gmail_oauth_state", "", { maxAge: 0, path: "/" });
    return response;
  } catch {
    return NextResponse.redirect(`${settingsBase}&error=connect_failed`);
  }
}
