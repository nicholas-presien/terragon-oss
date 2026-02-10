/**
 * Reengagement emails module - DISABLED in self-hosted mode.
 * All functions are stubs.
 */
import type { DB } from "../db/index.js";

interface AccessCodeRecord {
  id: string;
  code: string;
  email: string | null;
  createdAt: Date;
}

export async function getUnusedAccessCodesOlderThan({
  db,
  days,
}: {
  db: DB;
  days: number;
}): Promise<AccessCodeRecord[]> {
  return [];
}

export async function hasReengagementEmailBeenSent({
  db,
  accessCodeId,
}: {
  db: DB;
  accessCodeId: string;
}): Promise<boolean> {
  return false;
}

export async function recordReengagementEmail({
  db,
  accessCodeId,
  sentByUserId,
}: {
  db: DB;
  accessCodeId: string;
  sentByUserId: string;
}): Promise<void> {
  // No-op in self-hosted mode
}

interface ReengagementRecipient {
  accessCode: AccessCodeRecord;
  userId: string | null;
}

export async function getEligibleReengagementRecipients({
  db,
}: {
  db: DB;
}): Promise<ReengagementRecipient[]> {
  return [];
}
