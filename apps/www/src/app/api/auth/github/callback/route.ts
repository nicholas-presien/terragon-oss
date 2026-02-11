import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForToken,
  getGitHubUser,
  getGitHubUserPrimaryEmail,
  findOrCreateUserFromGitHub,
  fireNewUserHooks,
  createSession,
  getSessionCookieName,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_denied", request.url),
    );
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL("/login?error=missing_params", request.url),
    );
  }

  const cookieStore = await cookies();

  // Validate state (CSRF protection)
  const storedState = cookieStore.get("oauth_state")?.value;
  if (!storedState || storedState !== stateParam) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", request.url),
    );
  }

  // Get PKCE code verifier
  const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL("/login?error=missing_verifier", request.url),
    );
  }

  // Parse state to extract callbackURL
  let callbackURL = "/";
  try {
    const statePayload = JSON.parse(
      Buffer.from(stateParam, "base64url").toString("utf8"),
    );
    callbackURL = statePayload.callbackURL || "/";
  } catch {
    // fallback to /
  }

  // Clear OAuth cookies
  cookieStore.delete("oauth_code_verifier");
  cookieStore.delete("oauth_state");

  try {
    // Determine redirect URI (must match the one used in login)
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUri = `${baseUrl}/api/auth/github/callback`;

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(
      code,
      codeVerifier,
      redirectUri,
    );
    console.log("GitHub OAuth token scopes:", tokenData.scope);

    // Fetch GitHub user profile
    const githubUser = await getGitHubUser(tokenData.access_token);
    console.log("GitHub user:", {
      id: githubUser.id,
      login: githubUser.login,
      email: githubUser.email,
    });
    let email = githubUser.email;
    if (!email) {
      const primaryEmail = await getGitHubUserPrimaryEmail(
        tokenData.access_token,
      );
      console.log("GitHub primary email lookup:", primaryEmail);
      email = primaryEmail;
    }
    if (!email) {
      return NextResponse.redirect(
        new URL("/login?error=no_email", request.url),
      );
    }

    // Find or create user + account
    const { user, isNewUser } = await findOrCreateUserFromGitHub({
      githubId: String(githubUser.id),
      name: githubUser.name || githubUser.login,
      email,
      image: githubUser.avatar_url,
      accessToken: tokenData.access_token,
      scope: tokenData.scope,
    });

    // Fire PostHog + Loops hooks for new users
    if (isNewUser) {
      await fireNewUserHooks({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }

    // Create session
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = request.headers.get("user-agent") || null;
    const session = await createSession(user.id, {
      ipAddress: ip ?? undefined,
      userAgent: ua ?? undefined,
    });

    // Set session cookie
    cookieStore.set(
      getSessionCookieName(),
      session.token,
      SESSION_COOKIE_OPTIONS,
    );

    // Handle the "close" callback (for popup auth flows like desktop app)
    if (callbackURL === "close") {
      return new Response(
        "<html><body><script>window.close();</script></body></html>",
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    return NextResponse.redirect(new URL(callbackURL, request.url));
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", request.url),
    );
  }
}
