import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { getGitHubAuthorizationURL } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callbackURL = searchParams.get("callbackURL") || "/";

  // Generate PKCE code verifier and challenge
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Generate CSRF state token
  const statePayload = JSON.stringify({
    csrf: randomBytes(16).toString("hex"),
    callbackURL,
  });
  const state = Buffer.from(statePayload).toString("base64url");

  // Determine redirect URI
  const baseUrl =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/github/callback`;

  // Store PKCE verifier and state in HTTP-only cookies
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600, // 10 minutes
  };

  cookieStore.set("oauth_code_verifier", codeVerifier, cookieOptions);
  cookieStore.set("oauth_state", state, cookieOptions);

  const authUrl = getGitHubAuthorizationURL({
    redirectUri,
    state,
    codeChallenge,
  });

  return NextResponse.redirect(authUrl);
}
