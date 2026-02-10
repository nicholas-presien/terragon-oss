/**
 * Allowed signups module - DISABLED in self-hosted mode.
 * All functions are stubs that allow unrestricted signups.
 */
import { DB } from "../db";
import { AllowedSignupWithUserId } from "../db/types";

export async function listAllowedSignups({
  db,
}: {
  db: DB;
}): Promise<AllowedSignupWithUserId[]> {
  return [];
}

export async function addAllowedSignup({
  db,
  email,
}: {
  db: DB;
  email: string;
}) {
  // No-op in self-hosted mode
}

export async function removeAllowedSignup({ db, id }: { db: DB; id: string }) {
  // No-op in self-hosted mode
}

export async function isSignupAllowed({
  db,
  email,
}: {
  db: DB;
  email: string;
}) {
  // Always allow signups in self-hosted mode
  return true;
}
