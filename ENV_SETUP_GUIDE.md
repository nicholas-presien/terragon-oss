# Environment Variables Setup Guide

This guide explains which environment variables you need based on what features you want to use.

## Minimal Setup (UI Only)

To just get the app running and see the UI:

```bash
# 1. Make sure Docker containers are running
pnpm -C packages/dev-env docker-up-dev

# 2. Initialize the database (first time only)
bash scripts/init-dev-db.sh

# 3. Start the development server
pnpm dev
```

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

### 3. GitHub Integration

**Required:**

```bash
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_APP_ID=...
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET=...  # Generate with: openssl rand -hex 32
NEXT_PUBLIC_GITHUB_APP_NAME=your-app-name
```

**Setup:** Create a GitHub App at https://github.com/settings/apps/new

**Enables:**

- ✅ GitHub OAuth login
- ✅ Repository access
- ✅ Automated commits and PRs
- ✅ Webhook integration

### 4. File Uploads & Attachments

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

### 5. Commit Message Generation

**Required:**

```bash
OPENAI_API_KEY=sk-...  # Get from https://platform.openai.com/api-keys
```

**Enables:**

- ✅ AI-generated commit messages
- ✅ PR description generation

### 6. Remote Sandbox Communication

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

### 7. Email Notifications (Optional)

**Required:**

```bash
RESEND_API_KEY=...  # Get from https://resend.com
```

**Enables:**

- ✅ Send transactional emails
- ✅ User onboarding emails

### 8. Slack Integration (Optional)

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

For a good development experience with core features:

```bash
# Essential
ANTHROPIC_API_KEY=...     # For Claude agents
E2B_API_KEY=...           # For sandboxes
OPENAI_API_KEY=...        # For commit messages

# Important (if using GitHub features)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
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

1. **Start with minimal** - No env vars, just see the UI
2. **Add Claude** - Get `ANTHROPIC_API_KEY` to test AI features
3. **Add E2B** - Get `E2B_API_KEY` to create sandboxes
4. **Add GitHub** - Set up GitHub App for full integration
5. **Add others** - R2, ngrok, etc. as needed

## Getting API Keys

- **Anthropic**: https://console.anthropic.com/settings/keys
- **E2B**: https://e2b.dev/dashboard
- **OpenAI**: https://platform.openai.com/api-keys
- **GitHub App**: https://github.com/settings/apps/new
- **Cloudflare R2**: https://dash.cloudflare.com
- **ngrok**: https://dashboard.ngrok.com
- **Resend**: https://resend.com/api-keys
