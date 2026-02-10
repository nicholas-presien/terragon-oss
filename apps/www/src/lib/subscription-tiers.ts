import { db } from "@/lib/db";
import { getUserSettings } from "@terragon/shared/model/user";
import { getFeatureFlagForUser } from "@terragon/shared/model/feature-flags";
import type { SandboxSize } from "@terragon/types/sandbox";

// Self-hosted configuration: All users get maximum allowances
const maxConcurrentTasks = 10;

export const DEFAULT_SANDBOX_SIZE: SandboxSize = "small";

// Maximum number of automations allowed per user (without unlimited feature flag)
export const DEFAULT_MAX_AUTOMATIONS = 20;

export const maxConcurrentTasksPerUser = maxConcurrentTasks;

export async function getSandboxSizeForUser(
  userId: string,
): Promise<SandboxSize> {
  const [userSettings, largeSandboxSizeEnabled] = await Promise.all([
    getUserSettings({ db, userId }),
    getFeatureFlagForUser({
      db,
      userId,
      flagName: "enableLargeSandboxSize",
    }),
  ]);

  if (!largeSandboxSizeEnabled) {
    return DEFAULT_SANDBOX_SIZE;
  }

  const sandboxSize = userSettings.sandboxSize ?? DEFAULT_SANDBOX_SIZE;

  // Self-hosted: Allow large sandboxes for all users
  if (sandboxSize === "large") {
    return "large";
  }

  return "small";
}

export async function getMaxConcurrentTaskCountForUser(
  userId: string,
): Promise<number> {
  // Self-hosted: All users get maximum concurrent tasks
  return maxConcurrentTasks;
}

export async function getMaxAutomationsForUser(
  userId: string,
): Promise<number | null> {
  const hasUnlimitedFlag = await getFeatureFlagForUser({
    db,
    userId,
    flagName: "allowUnlimitedAutomations",
  });

  // Self-hosted: All users get unlimited automations, or use feature flag override
  return hasUnlimitedFlag ? null : null;
}
