import { db } from "@/lib/db";
import {
  User,
  Session,
  UserSettings,
  UserFlags,
  UserCredentials,
} from "@terragon/shared";
import { getUserSettings } from "@terragon/shared/model/user";
import { getUserFlags } from "@terragon/shared/model/user-flags";
import { cache } from "react";
import { env } from "@terragon/env/apps-www";
import { getFeatureFlagsForUser } from "@terragon/shared/model/feature-flags";
import { UserCookies } from "@/lib/cookies";
import { getUserCookies } from "./cookies-server";
import { redirect } from "next/navigation";
import {
  ServerActionOptions,
  wrapServerActionInternal,
  UserFacingError,
  ServerActionResult,
} from "./server-actions";
import { getUserCredentials } from "@/server-lib/user-credentials";
import { DEFAULT_USER_ID, DEFAULT_USER, DEFAULT_SESSION } from "./default-user";

export const getSessionOrNull = cache(
  async (): Promise<{
    session: Session;
    user: User;
  } | null> => {
    return { session: DEFAULT_SESSION, user: DEFAULT_USER };
  },
);

export async function getUserIdOrNull(): Promise<User["id"] | null> {
  return DEFAULT_USER_ID;
}

export async function getUserIdOrRedirect(): Promise<User["id"]> {
  return DEFAULT_USER_ID;
}

export async function getUserIdOrNullFromDaemonToken(
  request: Pick<Request, "headers">,
): Promise<string | null> {
  const token = request.headers.get("X-Daemon-Token");
  if (!token) {
    return null;
  }
  if (token === env.INTERNAL_SHARED_SECRET) {
    return DEFAULT_USER_ID;
  }
  return null;
}

export async function getUserOrNull(): Promise<User | null> {
  return DEFAULT_USER;
}

type UserInfo = {
  user: User;
  session: Session;
  userSettings: UserSettings;
  userFlags: UserFlags;
  userCredentials: UserCredentials;
  userFeatureFlags: Record<string, boolean>;
  userCookies: UserCookies;
  impersonation: {
    isImpersonating: boolean;
    impersonatedBy?: string;
  };
};

export const getUserInfoOrNull = cache(async (): Promise<UserInfo | null> => {
  const [
    userSettings,
    userFlags,
    userFeatureFlags,
    userCookies,
    userCredentials,
  ] = await Promise.all([
    getUserSettings({
      db,
      userId: DEFAULT_USER_ID,
    }),
    getUserFlags({
      db,
      userId: DEFAULT_USER_ID,
    }),
    getFeatureFlagsForUser({
      db,
      userId: DEFAULT_USER_ID,
    }),
    getUserCookies(),
    getUserCredentials({
      userId: DEFAULT_USER_ID,
    }),
  ]);
  return {
    session: DEFAULT_SESSION,
    user: DEFAULT_USER,
    userSettings,
    userFlags: getUserFlagsNormalized(userFlags),
    userFeatureFlags,
    userCookies,
    userCredentials,
    impersonation: {
      isImpersonating: false,
    },
  };
});

export async function getUserInfoOrRedirect(): Promise<UserInfo> {
  const userInfo = await getUserInfoOrNull();
  if (!userInfo) {
    redirect("/");
  }
  return userInfo;
}

async function getAdminUserOrNull(): Promise<User | null> {
  return DEFAULT_USER;
}

export async function getAdminUserOrThrow(): Promise<User> {
  return DEFAULT_USER;
}

function userOnly<T extends Array<any>, U>(
  callback: (userId: string, ...args: T) => Promise<U>,
) {
  const wrapped = async (...args: T): Promise<U> => {
    return await callback(DEFAULT_USER_ID, ...args);
  };
  // For testing purposes
  wrapped.userOnly = true;
  return wrapped;
}

export function userOnlyAction<T extends Array<any>, U>(
  callback: (userId: string, ...args: T) => Promise<U>,
  options: ServerActionOptions,
) {
  type UserOnlyAction = {
    (...args: T): Promise<ServerActionResult<U>>;
    userOnly?: boolean;
    wrappedServerAction?: boolean;
  };
  const userOnlyCallback = userOnly(callback);
  const userOnlyAction: UserOnlyAction = wrapServerActionInternal(
    userOnlyCallback,
    options,
  );
  userOnlyAction.userOnly = true;
  userOnlyAction.wrappedServerAction = true;
  return userOnlyAction;
}

export function adminOnly<T extends Array<any>, U>(
  callback: (adminUser: User, ...args: T) => Promise<U>,
) {
  const wrapped = async (...args: T): Promise<U> => {
    return await callback(DEFAULT_USER, ...args);
  };
  // For testing purposes
  wrapped.adminOnly = true;
  return wrapped;
}

export function adminOnlyAction<T extends Array<any>, U>(
  callback: (adminUser: User, ...args: T) => Promise<U>,
  options: ServerActionOptions,
) {
  type AdminOnlyAction = {
    (...args: T): Promise<ServerActionResult<U>>;
    adminOnly?: boolean;
    wrappedServerAction?: boolean;
  };
  const adminOnlyCallback = adminOnly(callback);
  const adminOnlyAction: AdminOnlyAction = wrapServerActionInternal(
    adminOnlyCallback,
    options,
  );
  adminOnlyAction.adminOnly = true;
  adminOnlyAction.wrappedServerAction = true;
  return adminOnlyAction;
}

export async function getCurrentUser(): Promise<User> {
  return DEFAULT_USER;
}

function getUserFlagsNormalized(userFlags: UserFlags) {
  return {
    ...userFlags,
    // In development, we want to show the debug tools by default.
    showDebugTools:
      userFlags.showDebugTools || process.env.NODE_ENV === "development",
    // Ensure isClaudeMaxSub is always defined
    isClaudeMaxSub: userFlags.isClaudeMaxSub ?? false,
    // Ensure isClaudeSub is always defined
    isClaudeSub: userFlags.isClaudeSub ?? false,
  };
}

export async function validInternalRequestOrThrow() {
  const { headers } = await import("next/headers");
  const requestHeaders = await headers();
  const secret = requestHeaders.get("X-Terragon-Secret");
  if (secret !== env.INTERNAL_SHARED_SECRET) {
    console.error("Unauthorized internal request");
    throw new Error("Unauthorized");
  }
}
