import { envsafe, str, num } from "envsafe";
import {
  devDefaultDatabaseUrl,
  devDefaultCronSecret,
  devDefaultInternalSharedSecret,
  devDefaultIsAnthropicDownUrl,
  devDefaultIsAnthropicDownApiSecret,
  devDefaultRedisUrl,
  devDefaultRedisToken,
} from "./common";

export const env = envsafe({
  DATABASE_URL: str({
    devDefault: devDefaultDatabaseUrl,
  }),
  REDIS_URL: str({
    devDefault: devDefaultRedisUrl,
  }),
  REDIS_TOKEN: str({
    devDefault: devDefaultRedisToken,
  }),
  IS_ANTHROPIC_DOWN_URL: str({
    devDefault: devDefaultIsAnthropicDownUrl,
  }),
  IS_ANTHROPIC_DOWN_API_SECRET: str({
    devDefault: devDefaultIsAnthropicDownApiSecret,
  }),
  // Used to authenticate internal request between services (eg. www -> broadcast)
  INTERNAL_SHARED_SECRET: str({
    devDefault: devDefaultInternalSharedSecret,
  }),
  // Vercel cron jobs
  CRON_SECRET: str({
    devDefault: devDefaultCronSecret,
  }),
  // Master key for encrypting sensitive user data at rest (e.g. user credentials)
  ENCRYPTION_MASTER_KEY: str({
    devDefault: "dev-encryption-master-key-32chars!!",
  }),

  // AI Providers (optional in dev - features won't work without them)
  ANTHROPIC_API_KEY: str({ allowEmpty: true, default: "" }),
  OPENAI_API_KEY: str({ allowEmpty: true, default: "" }),
  OPENROUTER_API_KEY: str({ allowEmpty: true, default: "" }),
  GOOGLE_AI_STUDIO_API_KEY: str({ allowEmpty: true, default: "" }),

  // Deprecated, use LOCALHOST_PUBLIC_DOMAIN instead
  NGROK_DOMAIN: str({ allowEmpty: true, default: "" }),
  LOCALHOST_PUBLIC_DOMAIN: str({ allowEmpty: true, default: "" }),

  // R2 (optional in dev - file uploads won't work without them)
  R2_ACCESS_KEY_ID: str({ allowEmpty: true, default: "" }),
  R2_SECRET_ACCESS_KEY: str({ allowEmpty: true, default: "" }),
  R2_ACCOUNT_ID: str({ allowEmpty: true, default: "" }),
  R2_BUCKET_NAME: str({ allowEmpty: true, default: "" }),
  R2_PRIVATE_BUCKET_NAME: str({ allowEmpty: true, default: "" }),
  R2_PUBLIC_URL: str({ allowEmpty: true, default: "" }),
  R2_ENDPOINT: str({ allowEmpty: true, default: "" }),

  // Sandbox providers (optional in dev - sandbox creation won't work without them)
  E2B_API_KEY: str({ allowEmpty: true, default: "" }),
  DAYTONA_API_KEY: str({ default: "", allowEmpty: true }),

  // GitHub App (optional in dev - GitHub auth and integration won't work without them)
  GITHUB_CLIENT_ID: str({ allowEmpty: true, default: "" }),
  GITHUB_CLIENT_SECRET: str({ allowEmpty: true, default: "" }),
  NEXT_PUBLIC_GITHUB_APP_NAME: str({ allowEmpty: true, devDefault: "" }),
  GITHUB_WEBHOOK_SECRET: str({ allowEmpty: true, default: "" }),
  GITHUB_APP_ID: str({ allowEmpty: true, default: "" }),
  GITHUB_APP_PRIVATE_KEY: str({ allowEmpty: true, default: "" }),

  // Posthog
  NEXT_PUBLIC_POSTHOG_KEY: str({
    default: "phc_ITvLHD24gmXmQ4IbWa9DqWJyQZNJweLW8vOTpT9WkjS",
    allowEmpty: true,
  }),
  NEXT_PUBLIC_POSTHOG_HOST: str({
    default: "https://us.i.posthog.com",
    allowEmpty: true,
  }),

  // Slack Integration
  SLACK_SIGNING_SECRET: str({ allowEmpty: true, default: "" }),
  SLACK_FEEDBACK_WEBHOOK_URL: str({ allowEmpty: true, default: "" }),
  SLACK_CLIENT_ID: str({ allowEmpty: true, default: "" }),
  SLACK_CLIENT_SECRET: str({ allowEmpty: true, default: "" }),

  // Port used by the CLI tool for auth
  CLI_PORT: num({ default: 8742 }),

  // Others
  RESEND_API_KEY: str({ allowEmpty: true, default: "" }),
});
