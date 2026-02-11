// Re-export auth utilities for backwards compatibility.
// Files that previously imported from "@/lib/auth" can still do so.
export {
  createApiKey,
  verifyApiKey,
  setUserRole,
  listUsersByEmail,
  getSessionCookieName,
  SESSION_COOKIE_OPTIONS,
} from "./auth-utils";
