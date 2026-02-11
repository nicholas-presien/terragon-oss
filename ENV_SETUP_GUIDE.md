# Environment Variables Setup Guide

This guide explains which environment variables you need based on what features you want to use.

## Minimal Setup (UI Only)

To just get the app running and see the UI:

```bash
# 1. Make sure Docker containers are running
pnpm -C packages/dev-env docker-up-dev

# 2. Push the database schema (first time, or after schema changes)
cd packages/shared && npx drizzle-kit push && cd ../..

# 3. Start the development server
pnpm dev
```

> **Note:** Environment variables must be placed in `apps/www/.env.development.local` (not the workspace root) for Next.js to pick them up.

**What works:**

- ✅ App starts and runs on http://localhost:3000
- ✅ Basic UI navigation
- ✅ Database operations (using local PostgreSQL)
- ✅ Redis caching (using local Redis)

**What doesn't work:**

- ❌ Creating tasks/agents
- ❌ GitHub authentication
- ❌ File uploads
- ❌ AI features

## Feature-Specific Setup

### 1. Claude Agents (Core Feature)

**Required:**

```bash
ANTHROPIC_API_KEY=sk-ant-...  # Get from https://console.anthropic.com
```

**Enables:**

- ✅ Create and run Claude Code agents
- ✅ Chat with Claude in tasks

### 2. Sandbox Environments

**Required:**

```bash
E2B_API_KEY=...  # Get from https://e2b.dev/dashboard
```

**Optional (alternative to E2B):**

```bash
DAYTONA_API_KEY=...  # Get from https://daytona.io
```

**Enables:**

- ✅ Create isolated sandbox environments
- ✅ Run code in containers
- ✅ Execute agent tasks

### 3. GitHub Authentication (Required for Login)

**Required:**

```bash
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

**Setup:** Create a GitHub OAuth App at https://github.com/settings/developers

1. Click **New OAuth App**
2. Set **Homepage URL** to `http://localhost:3000`
3. Set **Authorization callback URL** to `http://localhost:3000/api/auth/github/callback`
4. Copy the **Client ID** and generate a **Client Secret**

**Enables:**

- ✅ GitHub OAuth login
- ✅ Repository access (via user's GitHub token)

### 4. GitHub App (Optional - for advanced integration)

**Required:**

```bash
GITHUB_APP_ID=...
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET=...  # Generate with: openssl rand -hex 32
NEXT_PUBLIC_GITHUB_APP_NAME=your-app-name
```

**Setup:** Create a GitHub App at https://github.com/settings/apps/new

**Enables:**

- ✅ Automated commits and PRs
- ✅ Webhook integration

### 5. File Uploads & Attachments

**Required:**

```bash
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ACCOUNT_ID=...
R2_BUCKET_NAME=...
R2_PRIVATE_BUCKET_NAME=...
R2_PUBLIC_URL=...
```

**Setup:** Create buckets at https://dash.cloudflare.com/?to=/:account/r2

**Enables:**

- ✅ Upload images to tasks
- ✅ Attach files to messages
- ✅ Store artifacts

### 6. Commit Message Generation

**Required:**

```bash
OPENAI_API_KEY=sk-...  # Get from https://platform.openai.com/api-keys
```

**Enables:**

- ✅ AI-generated commit messages
- ✅ PR description generation

### 7. Remote Sandbox Communication

**Required:**

```bash
NGROK_AUTH_TOKEN=...  # Get from https://dashboard.ngrok.com
NGROK_DOMAIN=your-domain.ngrok-free.app
```

**Or use a custom tunnel:**

```bash
CUSTOM_TUNNEL_COMMAND="cloudflared tunnel --url localhost:3000"
```

**Enables:**

- ✅ Remote sandboxes can ping back to your local server
- ✅ Real-time updates from agents

### 8. Email Notifications (Optional)

**Required:**

```bash
RESEND_API_KEY=...  # Get from https://resend.com
```

**Enables:**

- ✅ Send transactional emails
- ✅ User onboarding emails

### 9. Slack Integration (Optional)

**Required:**

```bash
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
SLACK_SIGNING_SECRET=...
```

**Enables:**

- ✅ Kick off tasks from Slack
- ✅ Slack notifications

## Recommended Development Setup

For a good development experience with core features, add these to `apps/www/.env.development.local`:

```bash
# Required for login
GITHUB_CLIENT_ID=...      # From GitHub OAuth App
GITHUB_CLIENT_SECRET=...

# Essential for agents
ANTHROPIC_API_KEY=...     # For Claude agents
E2B_API_KEY=...           # For sandboxes
OPENAI_API_KEY=...        # For commit messages

# Optional (for advanced GitHub features)
GITHUB_APP_ID=...
GITHUB_APP_PRIVATE_KEY=...
GITHUB_WEBHOOK_SECRET=...

# Optional (for full functionality)
NGROK_AUTH_TOKEN=...      # For remote sandbox communication
NGROK_DOMAIN=...
R2_ACCESS_KEY_ID=...      # For file uploads
R2_SECRET_ACCESS_KEY=...
R2_ACCOUNT_ID=...
R2_BUCKET_NAME=...
R2_PRIVATE_BUCKET_NAME=...
R2_PUBLIC_URL=...
```

## Quick Start Order

1. **Set up infrastructure** - Run Docker containers and push DB schema
2. **Add GitHub OAuth** - Create OAuth App, set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to enable login
3. **Add Claude** - Get `ANTHROPIC_API_KEY` to test AI features
4. **Add E2B** - Get `E2B_API_KEY` to create sandboxes
5. **Add others** - R2, ngrok, GitHub App, etc. as needed

## Getting API Keys

- **Anthropic**: https://console.anthropic.com/settings/keys
- **E2B**: https://e2b.dev/dashboard
- **OpenAI**: https://platform.openai.com/api-keys
- **GitHub App**: https://github.com/settings/apps/new
- **Cloudflare R2**: https://dash.cloudflare.com
- **ngrok**: https://dashboard.ngrok.com
- **Resend**: https://resend.com/api-keys
