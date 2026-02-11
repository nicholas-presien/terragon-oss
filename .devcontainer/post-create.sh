#!/bin/bash
set -e

echo "================================================"
echo "Terragon Development Container - Post Create"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Wait for Docker daemon to be ready
echo -e "${BLUE}Waiting for Docker daemon...${NC}"
until docker info > /dev/null 2>&1; do
  echo "Waiting for Docker..."
  sleep 2
done

# Start PostgreSQL container
echo -e "${BLUE}Starting PostgreSQL container...${NC}"
docker rm -f terragon_postgres 2>/dev/null || true
docker run -d \
  --name terragon_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=terragon \
  -p 5432:5432 \
  -v terragon-postgres-data:/var/lib/postgresql/data \
  postgres:16-alpine

# Start Redis container
echo -e "${BLUE}Starting Redis container...${NC}"
docker rm -f terragon_redis 2>/dev/null || true
docker run -d \
  --name terragon_redis \
  -p 6379:6379 \
  -v terragon-redis-data:/data \
  redis:7-alpine

# Start serverless-redis-http container
echo -e "${BLUE}Starting serverless-redis-http container...${NC}"
docker rm -f terragon_redis_http 2>/dev/null || true
docker run -d \
  --name terragon_redis_http \
  -p 8079:80 \
  -e SRH_MODE=env \
  -e SRH_TOKEN=redis_dev_token \
  -e SRH_CONNECTION_STRING="redis://host.docker.internal:6379" \
  --add-host host.docker.internal:host-gateway \
  hiett/serverless-redis-http:latest

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
until pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Wait for Redis to be ready
echo -e "${BLUE}Waiting for Redis to be ready...${NC}"
until redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; do
  echo "Waiting for Redis..."
  sleep 1
done

# Install dependencies
echo -e "${BLUE}Installing pnpm dependencies...${NC}"
pnpm install --frozen-lockfile

# Push database schema to development database
echo -e "${BLUE}Setting up database schema...${NC}"
pnpm -C packages/shared drizzle-kit-push-dev || {
  echo -e "${YELLOW}Warning: Database schema push failed. You may need to run this manually.${NC}"
}

# Build core packages
echo -e "${BLUE}Building core packages...${NC}"
pnpm -C packages/daemon build
pnpm -C packages/mcp-server build
pnpm -C packages/bundled build

# Setup Git hooks
echo -e "${BLUE}Setting up Git hooks...${NC}"
pnpm prepare

# Check for .env.development.local
if [ ! -f ".env.development.local" ]; then
  echo -e "${YELLOW}⚠️  No .env.development.local found${NC}"
  echo -e "${YELLOW}Creating template from .env.example...${NC}"

  if [ -f "apps/www/.env.example" ]; then
    cat apps/www/.env.example > .env.development.local
    echo -e "${GREEN}✓ Created .env.development.local${NC}"
    echo -e "${YELLOW}⚠️  Please configure your API keys and secrets!${NC}"
  fi
fi

# Install Terry CLI for development
echo -e "${BLUE}Installing Terry CLI...${NC}"
pnpm install-cli:dev || {
  echo -e "${YELLOW}Warning: CLI installation failed. You can install it later with 'pnpm install-cli:dev'${NC}"
}

# Configure ngrok if token is available
if [ -n "$NGROK_AUTH_TOKEN" ]; then
  echo -e "${BLUE}Configuring ngrok...${NC}"
  ngrok config add-authtoken "$NGROK_AUTH_TOKEN"
fi

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✓ Post-create setup complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure your .env.development.local with API keys"
echo "2. Run 'pnpm dev' to start all development services"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:3001 for documentation"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  pnpm dev              - Start all services"
echo "  pnpm tsc-watch        - Watch TypeScript compilation"
echo "  pnpm -C apps/www test - Run tests"
echo "  terry pull            - Pull threads with CLI"
echo "  terry create          - Create new task"
echo ""
