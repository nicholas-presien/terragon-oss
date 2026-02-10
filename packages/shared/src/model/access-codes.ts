/**
 * Access codes module - DISABLED in self-hosted mode.
 * All functions are stubs that throw errors or return empty results.
 */
import { DB } from "../db";

export async function generateAccessCode({
  db,
  createdByUserId,
  options,
}: {
  db: DB;
  createdByUserId: string;
  options?: {
    email?: string;
  };
}) {
  throw new Error("Access codes are not available in self-hosted mode");
}

export async function validateAccessCode({
  db,
  code,
}: {
  db: DB;
  code: string;
}) {
  return undefined;
}

export async function markAccessCodeAsUsed({
  db,
  code,
  email,
}: {
  db: DB;
  code: string;
  email: string;
}) {
  return undefined;
}

export async function getAccessCodesByCreator({
  db,
  createdByUserId,
}: {
  db: DB;
  createdByUserId: string;
}) {
  return [];
}

export async function deleteAccessCode({ db, id }: { db: DB; id: string }) {
  // No-op
}
