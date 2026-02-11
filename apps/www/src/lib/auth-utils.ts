import { db } from "./db";
import * as schema from "@terragon/shared/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { env } from "@terragon/env/apps-www";
import { encryptToken } from "@terragon/utils/encryption";
import { createHash, randomBytes } from "crypto";
import { getPostHogServer } from "./posthog-server";

// ── Constants ───────────────────────────────────────────────────────

const SESSION_COOKIE_NAME = "better-auth.session_token";
const SECURE_SESSION_COOKIE_NAME = "__Secure-better-auth.session_token";

export function getSessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? SECURE_SESSION_COOKIE_NAME
    : SESSION_COOKIE_NAME;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 60; // 60 days
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24; // 1 day

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

// ── Session Management ──────────────────────────────────────────────

export async function getSessionWithUser(token: string) {
  const sessions = await db
    .select()
    .from(schema.session)
    .where(eq(schema.session.token, token))
    .limit(1);

  if (sessions.length === 0) return null;
  const session = sessions[0]!;

  if (session.expiresAt < new Date()) {
    await db.delete(schema.session).where(eq(schema.session.id, session.id));
    return null;
  }

  const users = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, session.userId))
    .limit(1);

  if (users.length === 0) return null;

  return { session, user: users[0]! };
}

export async function createSession(
  userId: string,
  opts?: { ipAddress?: string; userAgent?: string },
) {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  const id = crypto.randomUUID();

  const [session] = await db
    .insert(schema.session)
    .values({
      id,
      userId,
      token,
      expiresAt,
      ipAddress: opts?.ipAddress ?? null,
      userAgent: opts?.userAgent ?? null,
      impersonatedBy: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return session!;
}

export async function refreshSessionIfNeeded(
  sessionId: string,
  expiresAt: Date,
) {
  // Session is "stale" if it was last updated more than SESSION_UPDATE_AGE ago
  const staleThreshold =
    expiresAt.valueOf() -
    SESSION_MAX_AGE_SECONDS * 1000 +
    SESSION_UPDATE_AGE_SECONDS * 1000;
  if (staleThreshold <= Date.now()) {
    const newExpiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
    await db
      .update(schema.session)
      .set({ expiresAt: newExpiresAt, updatedAt: new Date() })
      .where(eq(schema.session.id, sessionId));
  }
}

export async function deleteSession(token: string) {
  await db.delete(schema.session).where(eq(schema.session.token, token));
}

// ── API Key Management ──────────────────────────────────────────────

/**
 * Hash a raw API key using SHA-256 and base64url encoding (no padding).
 * Matches Better Auth's defaultKeyHasher for backwards compatibility.
 */
function hashApiKey(rawKey: string): string {
  const hash = createHash("sha256").update(rawKey).digest();
  return hash.toString("base64url");
}

export async function createApiKey(opts: {
  userId: string;
  name: string;
  expiresIn: number; // seconds
}): Promise<{ key: string; id: string }> {
  const rawKey = randomBytes(48).toString("base64url").slice(0, 64);
  const hashedKey = hashApiKey(rawKey);
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + opts.expiresIn * 1000);

  await db.insert(schema.apiKey).values({
    id,
    name: opts.name,
    start: rawKey.substring(0, 7),
    prefix: null,
    key: hashedKey,
    userId: opts.userId,
    enabled: true,
    rateLimitEnabled: false,
    expiresAt,
    createdAt: now,
    updatedAt: now,
    requestCount: 0,
  });

  return { key: rawKey, id };
}

export async function verifyApiKey(
  rawKey: string,
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const hashedKey = hashApiKey(rawKey);

  const keys = await db
    .select()
    .from(schema.apiKey)
    .where(eq(schema.apiKey.key, hashedKey))
    .limit(1);

  if (keys.length === 0) {
    return { valid: false, error: "Invalid API key" };
  }

  const apiKeyRecord = keys[0]!;

  if (apiKeyRecord.enabled === false) {
    return { valid: false, error: "API key is disabled" };
  }

  if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
    return { valid: false, error: "API key has expired" };
  }

  return { valid: true, userId: apiKeyRecord.userId };
}

// ── GitHub OAuth Helpers ────────────────────────────────────────────

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";
const GITHUB_EMAILS_URL = "https://api.github.com/user/emails";

export function getGitHubAuthorizationURL(params: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const url = new URL(GITHUB_AUTHORIZE_URL);
  url.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", "repo workflow read:user user:email");
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<{ access_token: string; token_type: string; scope: string }> {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(
      `GitHub OAuth error: ${data.error_description || data.error}`,
    );
  }
  return data;
}

export async function getGitHubUser(accessToken: string): Promise<{
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}> {
  const response = await fetch(GITHUB_USER_URL, {
    headers: { Authorization: `token ${accessToken}` },
  });
  if (!response.ok) throw new Error("Failed to fetch GitHub user");
  return response.json();
}

export async function getGitHubUserPrimaryEmail(
  accessToken: string,
): Promise<string | null> {
  const response = await fetch(GITHUB_EMAILS_URL, {
    headers: { Authorization: `token ${accessToken}` },
  });
  if (!response.ok) return null;
  const emails: Array<{
    email: string;
    primary: boolean;
    verified: boolean;
  }> = await response.json();
  const primary = emails.find((e) => e.primary && e.verified);
  return primary?.email ?? emails.find((e) => e.verified)?.email ?? null;
}

// ── User / Account Management ───────────────────────────────────────

export async function findOrCreateUserFromGitHub(profile: {
  githubId: string;
  name: string;
  email: string;
  image: string | null;
  accessToken: string;
  scope: string;
}): Promise<{
  user: typeof schema.user.$inferSelect;
  isNewUser: boolean;
}> {
  const encryptedAccessToken = encryptToken(
    profile.accessToken,
    env.ENCRYPTION_MASTER_KEY,
  );

  // Check if account already exists for this GitHub ID
  const existingAccounts = await db
    .select()
    .from(schema.account)
    .where(
      and(
        eq(schema.account.providerId, "github"),
        eq(schema.account.accountId, profile.githubId),
      ),
    )
    .limit(1);

  if (existingAccounts.length > 0) {
    const existingAccount = existingAccounts[0]!;

    // Update the access token
    await db
      .update(schema.account)
      .set({
        accessToken: encryptedAccessToken,
        scope: profile.scope,
        updatedAt: new Date(),
      })
      .where(eq(schema.account.id, existingAccount.id));

    const users = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, existingAccount.userId))
      .limit(1);

    if (users.length === 0) {
      throw new Error("User not found for existing account");
    }

    // Update user profile from GitHub (name, avatar may have changed)
    await db
      .update(schema.user)
      .set({
        name: profile.name,
        image: profile.image,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.id, existingAccount.userId));

    return {
      user: { ...users[0]!, name: profile.name, image: profile.image },
      isNewUser: false,
    };
  }

  // Check if user exists by email (link account to existing user)
  const existingUsers = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, profile.email.toLowerCase()))
    .limit(1);

  let userId: string;
  let isNewUser = false;

  if (existingUsers.length > 0) {
    userId = existingUsers[0]!.id;
  } else {
    userId = crypto.randomUUID();
    const now = new Date();
    await db.insert(schema.user).values({
      id: userId,
      name: profile.name,
      email: profile.email.toLowerCase(),
      emailVerified: true,
      image: profile.image,
      createdAt: now,
      updatedAt: now,
      role: "user",
    });
    isNewUser = true;
  }

  // Create account link
  await db.insert(schema.account).values({
    id: crypto.randomUUID(),
    userId,
    providerId: "github",
    accountId: profile.githubId,
    accessToken: encryptedAccessToken,
    scope: profile.scope,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1);

  return { user: user!, isNewUser };
}

export async function fireNewUserHooks(user: {
  id: string;
  name: string;
  email: string;
}) {
  getPostHogServer().capture({
    distinctId: user.id,
    event: "user_created",
    properties: {
      name: user.name,
      email: user.email,
      signupMethod: "github_oauth",
    },
  });

  // Loops integration removed - not needed in self-hosted mode
}

// ── Admin User Management ───────────────────────────────────────────

export async function setUserRole(userId: string, role: string) {
  await db
    .update(schema.user)
    .set({ role, updatedAt: new Date() })
    .where(eq(schema.user.id, userId));
}

export async function listUsersByEmail(opts: {
  limit: number;
  searchValue: string;
}) {
  return await db
    .select()
    .from(schema.user)
    .where(ilike(schema.user.email, `%${opts.searchValue}%`))
    .limit(opts.limit);
}
