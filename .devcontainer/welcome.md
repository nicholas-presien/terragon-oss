# Welcome to Terragon Development Environment

This devcontainer provides a complete development setup for the Terragon monorepo.

## What's Included

- Node.js 20
- pnpm 10.14.0
- PostgreSQL 16
- Redis 7
- Docker CLI (docker-outside-of-docker)
- Stripe CLI
- ngrok (tunnel service)
- cloudflared (alternative tunnel)
- GitHub CLI (gh)
- PostgreSQL client tools
- Redis client tools
- Terry CLI (Terragon's interactive CLI)

## Getting Started

### 1. Configure Environment Variables

Edit `.env.development.local` with your API keys:

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

### 2. Start Development

```bash
# Start all services (frontend, docs, broadcast, tunnel, cron)
pnpm dev

# Or start services individually
pnpm -C apps/www dev          # Frontend only
pnpm -C apps/docs dev          # Docs only
pnpm -C apps/broadcast dev     # WebSocket service
```

### 3. Access Services

- Frontend: http://localhost:3000
- Documentation: http://localhost:3001
- Broadcast (PartyKit): http://localhost:1999
- ngrok Inspector: http://localhost:4040

### 4. Database Management

```bash
# Push schema changes
pnpm -C packages/shared drizzle-kit-push-dev

# Open Drizzle Studio (database GUI)
pnpm -C packages/shared drizzle-kit-studio-dev

# Direct PostgreSQL access
psql -h postgres -U postgres -d terragon

# Redis access
redis-cli -h redis
```

## Common Tasks

### Running Tests

```bash
# Run all tests
pnpm -C apps/www test
pnpm -C packages/shared test
pnpm -C packages/daemon test

# Watch mode
pnpm -C apps/www test -- --watch
```

### Type Checking

```bash
# Check all packages
pnpm tsc-check

# Watch mode
pnpm tsc-watch
```

### Code Formatting

```bash
# Format all code
pnpm format

# Check formatting
pnpm format-check
```

### Terry CLI

```bash
# Pull threads
terry pull

# Create new task
terry create

# Authentication
terry auth

# List threads
terry list

# MCP configuration
terry mcp
```

### Docker Operations

```bash
# View running containers
docker ps

# View logs
docker logs terragon_postgres_dev
docker logs terragon_redis_dev

# Restart services
pnpm -C packages/dev-env docker-down-dev
pnpm -C packages/dev-env docker-up-dev
```

### Debugging E2B Sandboxes

```bash
# SSH into a sandbox
pnpm -C packages/debug-scripts e2b-ssh <sandbox-id>
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, check if services are already running:

```bash
lsof -i :3000  # Check port 3000
lsof -i :5432  # Check PostgreSQL
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h postgres -p 5432 -U postgres

# View PostgreSQL logs
docker logs terragon_postgres_dev
```

### pnpm Install Fails

```bash
# Clear pnpm store and reinstall
pnpm store prune
pnpm install --force
```

### TypeScript Errors

```bash
# Rebuild all packages
pnpm -C packages/daemon build
pnpm -C packages/bundled build

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## Project Structure

```
terragon/
├── apps/
│   ├── www/              # Main Next.js frontend
│   ├── docs/             # Documentation site
│   ├── broadcast/        # PartyKit WebSocket service
│   ├── cli/              # Terry CLI tool
│   ├── desktop/          # Electron desktop app
│   └── vscode-extension/ # VS Code extension
├── packages/
│   ├── shared/           # Database models and core utilities
│   ├── daemon/           # Sandbox agent runtime
│   ├── sandbox/          # Sandbox provider abstraction
│   ├── env/              # Environment configuration
│   └── dev-env/          # Development environment setup
└── .devcontainer/        # This devcontainer configuration
```

## Resources

- [Project Documentation](http://localhost:3001)
- [AGENTS.md](../AGENTS.md) - Project overview
- [Terragon Repository](https://github.com/yourusername/terragon)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review service logs: `docker logs <container-name>`
3. Ensure all environment variables are set
4. Try restarting the devcontainer
