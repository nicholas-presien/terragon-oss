// Subscription messages stub for self-hosted mode.
// These should be unreachable since tier is always "pro".

export const SUBSCRIPTION_MESSAGES = {
  CREATE_TASK: "Unexpected error - please try again.",
  FOLLOW_UP: "Unexpected error - please try again.",
  QUEUE_FOLLOW_UP: "Unexpected error - please try again.",
  RUN_TASK: "Unexpected error - please try again.",
  RUN_AUTOMATION: "Unexpected error - please try again.",
  CREATE_AUTOMATION: "Unexpected error - please try again.",
} as const;
