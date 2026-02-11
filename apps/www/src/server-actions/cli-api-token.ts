"use server";

import { nanoid } from "nanoid/non-secure";
import { userOnlyAction } from "@/lib/auth-server";
import { createApiKey } from "@/lib/auth-utils";

export const createCliApiToken = userOnlyAction(
  async function createCliApiToken(userId: string) {
    const result = await createApiKey({
      name: `cli-${nanoid()}`,
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      userId,
    });
    return result.key;
  },
  { defaultErrorMessage: "Failed to create CLI API token" },
);
