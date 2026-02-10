# Terragon

> **Snapshot notice (January 16, 2026):** This repository is an open-source snapshot of Terragon at the time of shutdown. It is provided **as-is**, with no guarantees of maintenance, support, or completeness.

![Terragon](https://cdn.terragonlabs.com/dashboard-beRp.png)

Delegate work to coding agents in the cloud.

For trademark use, see `TRADEMARKS.md`.

## Features

- **Multi-Agent Support**: Use multiple coding agents, including [Claude Code](https://www.anthropic.com/products/claude-code), [OpenAI Codex](https://github.com/openai/codex), [Amp](https://ampcode.com/), and [Gemini](https://github.com/google-gemini/gemini-cli). Easily add support for more agents as needed.
- **Sandbox Isolation**: Each agent runs in an isolated sandbox container with its own copy of the repository. Agents can read files, make changes, and run tests without affecting other concurrent tasks or your local environment.
- **Seamless Git Workflow**: Tasks are automatically assigned unique branches, and agent work is checkpointed and pushed to GitHub with AI-generated commits and Pull Requests. The git workflow can be disabled as needed for maximum flexibility.
- **Local Handoff & MCP**: The `terry` CLI tool enables easy local task takeover and continuation. It also includes an MCP server for managing and creating tasks from MCP-compatible clients (e.g., Cursor, Claude Code).
- **BYO Subscription & API Keys**: Use your existing Claude or ChatGPT subscriptions to power coding agents, or configure Terragon with your own API keys.
- **Automations**: Create recurring tasks or event-triggered workflows (e.g., on new issues or pull requests) to automate repetitive development tasks.
- **Integrates with Existing Workflows**: @-mention Terragon tools like Slack or GitHub to kick off tasks directly where context already exists.
- **Real-time Management**: Task status and agent progress stream to your browser in real-time. Browser notifications keep you informed when tasks complete.

## Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: v10.14.0 or higher
- **Docker**: Required for local development (PostgreSQL, Redis containers)

## Setup

1. **Install dependencies**

```bash
pnpm install
```

2. **Environment Configuration (Optional)**

> **Quick Start:** You can skip this step initially! The app will start without environment variables, but features like AI agents, GitHub integration, and file uploads won't work.

For a full setup, copy the example environment files:

```bash
# Main application (most important)
cp apps/www/.env.example apps/www/.env.development.local

# Optional: Other services
cp packages/dev-env/.env.example packages/dev-env/.env.development.local
cp apps/broadcast/.env.example apps/broadcast/.env
cp packages/shared/.env.example packages/shared/.env.development.local
```

**What you need depends on what features you want:**

- **Minimal (UI only)** - No env vars needed! ✨
- **Core features** - `ANTHROPIC_API_KEY`, `E2B_API_KEY`, `OPENAI_API_KEY`
- **Full setup** - See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for detailed instructions

The app will run without these and show warnings about missing features.

3. **Initialize database**

Set up the database schema and create the default self-hosted user:

```bash
bash scripts/init-dev-db.sh
```

> **Note:** This script generates migrations, applies them to your local PostgreSQL database, and creates a default admin user for self-hosted mode. You only need to run this once during initial setup.
>
> When you make changes to the database schema later, regenerate migrations with `pnpm -C packages/shared drizzle-kit generate` and apply them with the script above.

4. **Start development servers**

```bash
pnpm dev
```

This will start all the relevant services for development.

- Ensure postgres and redis are running
- Local tunnel
- Main app (`apps/www`) on port 3000
- WebSocket service (`apps/broadcast`)
- Docs site (`apps/docs`) on port 3001

## Running with Dev Containers (Alternative Setup)

For a simpler setup experience, you can use VS Code Dev Containers, which provides a pre-configured development environment with all dependencies installed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/terragon.git
cd terragon
```

2. **Open in VS Code**

```bash
code .
```

3. **Reopen in Container**

When VS Code opens, you'll see a notification asking if you want to "Reopen in Container". Click **Reopen in Container**.

Alternatively, you can:

- Press `F1` or `Cmd/Ctrl + Shift + P`
- Type "Dev Containers: Reopen in Container"
- Press Enter

4. **Wait for Container Setup**

The first time you open the devcontainer, it will:

- Build the Docker image (Node.js 20, pnpm 10.14.0, PostgreSQL client, Redis tools, ngrok, GitHub CLI)
- Start PostgreSQL 16 and Redis 7 containers (shared with the devcontainer)
- Install all pnpm dependencies
- Push the database schema
- Build core packages (daemon, mcp-server, bundled)
- Install the Terry CLI
- Create a template `.env.development.local` file

This process takes 5-10 minutes on the first run. Subsequent starts are much faster.

**Note:** The devcontainer uses Docker-outside-of-Docker, meaning containers run on your host machine and are shared between your devcontainer and host. The setup scripts automatically detect if containers are already running and skip starting them to avoid conflicts.

5. **Configure Environment Variables**

After the container is ready, edit `.env.development.local` with your API keys:

```bash
# Required for AI features
ANTHROPIC_API_KEY=your_key_here
E2B_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Required for GitHub integration
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY="your_private_key"

# Required for tunnel (development)
NGROK_AUTH_TOKEN=your_token
NGROK_DOMAIN=your_static_domain.ngrok-free.app

# Optional: Storage, email, etc.
R2_ACCESS_KEY_ID=your_key
R2_SECRET_ACCESS_KEY=your_secret
RESEND_API_KEY=your_key
```

6. **Start Development**

```bash
pnpm dev
```

### What's Included

The devcontainer provides:

- **Node.js 20** with **pnpm 10.14.0**
- **PostgreSQL 16** (accessible at `postgres:5432`)
- **Redis 7** (accessible at `redis:6379`)
- **Docker CLI** (docker-outside-of-docker for running containers)
- **ngrok** for local tunnel
- **GitHub CLI (gh)** for GitHub operations
- **Terry CLI** pre-installed for task management
- **VS Code extensions**: ESLint, Prettier, Tailwind CSS, GitLens, and more

### Port Forwarding

The following ports are automatically forwarded:

- **3000**: Frontend (Next.js)
- **3001**: Documentation site
- **1999**: Broadcast (PartyKit WebSocket)
- **5432**: PostgreSQL
- **6379**: Redis
- **4040**: ngrok Inspector
- **8079**: Redis HTTP
- **9229**: Node.js Debugger

### Useful Commands in Devcontainer

```bash
# Start all services
pnpm dev

# Run tests
pnpm -C apps/www test
pnpm -C packages/shared test

# Database management
pnpm -C packages/shared drizzle-kit-push-dev      # Push schema
pnpm -C packages/shared drizzle-kit-studio-dev    # Open Drizzle Studio
psql -h postgres -U postgres -d terragon          # Direct PostgreSQL access

# Terry CLI
terry pull          # Pull and work on threads locally
terry create        # Create new task
terry auth          # Authenticate
terry list          # List threads
terry mcp           # MCP configuration

# Type checking
pnpm tsc-check      # Check all packages
pnpm tsc-watch      # Watch mode

# Debug E2B sandboxes
pnpm -C packages/debug-scripts e2b-ssh <sandbox-id>
```

### Troubleshooting Devcontainer

**Container fails to start:**

- Ensure Docker Desktop is running
- Check that ports 5432 and 6379 are not already in use
- Try rebuilding: `F1` → "Dev Containers: Rebuild Container"

**Dependencies out of date:**

```bash
pnpm install --force
```

**Database schema issues:**

```bash
pnpm -C packages/shared drizzle-kit-push-dev
```

**TypeScript errors:**

```bash
# Rebuild packages
pnpm -C packages/daemon build
pnpm -C packages/bundled build

# In VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

For more detailed information, see [.devcontainer/welcome.md](.devcontainer/welcome.md).
