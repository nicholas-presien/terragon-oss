import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";
const PREFIX = "@upstash/ratelimit";

const productionRefillRate = 20;
const productionWindow = "1h";
const productionMaxTokens = 20;
// In development, we want to be able to test the rate limit more easily.
const developmentRefillRate = 100;
const developmentWindow = "1h";
const developmentMaxTokens = 100;

export const sandboxCreationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(
    process.env.NODE_ENV === "production"
      ? productionRefillRate
      : developmentRefillRate,
    process.env.NODE_ENV === "production"
      ? productionWindow
      : developmentWindow,
    process.env.NODE_ENV === "production"
      ? productionMaxTokens
      : developmentMaxTokens,
  ),
  prefix: `${PREFIX}:sandbox-creation`,
});

export async function trackSandboxCreation(userId: string) {
  const result = await sandboxCreationRateLimit.limit(userId);
  // Don't throw an error here, just log a warning because there might be a race condition
  // between the rate limit check and the sandbox creation and its okay if we go over.
  if (!result.success) {
    console.log(
      `Going over sandbox creation rate limit: ${result.remaining} remaining, reset in ${result.reset}`,
    );
  }
}

// CLI task creation rate limiting (by user ID)
export const cliTaskCreationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    50, // 50 tasks
    "1d", // per day
  ),
  prefix: `${PREFIX}:cli-task-creation`,
});

export async function checkCliTaskCreationRateLimit(userId: string) {
  const result = await cliTaskCreationRateLimit.limit(userId);
  if (!result.success) {
    const hoursUntilReset = Math.ceil(
      (result.reset - Date.now()) / 1000 / 60 / 60,
    );
    throw new Error(
      `Daily task creation limit reached (50 tasks per day). Try again in ${hoursUntilReset} hours.`,
    );
  }
  return result;
}
