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

# Install dependencies
echo -e "${BLUE}Installing pnpm dependencies...${NC}"
pnpm install --frozen-lockfile

# Wait for PostgreSQL to be ready
echo -e "${BLUE}Waiting for PostgreSQL to be ready...${NC}"
until pg_isready -h postgres -p 5432 -U postgres; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

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
