import type { User, Session } from "@terragon/shared";

// Hardcoded default user for self-hosted mode (no auth required)
export const DEFAULT_USER_ID = "self-hosted-default-user";

export const DEFAULT_USER: User = {
  id: DEFAULT_USER_ID,
  name: "Self-Hosted User",
  email: "admin@localhost",
  emailVerified: true,
  image: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  role: "admin",
  banned: false,
  banReason: null,
  banExpires: null,
  shadowBanned: false,
};

export const DEFAULT_SESSION: Session = {
  id: "self-hosted-session",
  expiresAt: new Date("2099-12-31"),
  token: "self-hosted-bearer-token",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ipAddress: null,
  userAgent: null,
  userId: DEFAULT_USER_ID,
  impersonatedBy: null,
};
