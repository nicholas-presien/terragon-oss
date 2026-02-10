#!/bin/bash
set -e

# This script runs every time the container starts

echo "Terragon Development Container - Starting..."

# Verify services are ready
echo "Checking service health..."

# PostgreSQL
if pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; then
  echo "✓ PostgreSQL is ready"
else
  echo "⚠️  PostgreSQL is not ready yet"
fi

# Redis
if redis-cli -h redis ping > /dev/null 2>&1; then
  echo "✓ Redis is ready"
else
  echo "⚠️  Redis is not ready yet"
fi

# Check if node_modules needs update
if [ -f "package.json" ]; then
  if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Dependencies may be out of date. Consider running 'pnpm install'"
  fi
fi

echo "Container ready! Run 'pnpm dev' to start development."
