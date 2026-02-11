#!/bin/bash
set -e

# This script runs every time the container starts

echo "Terragon Development Container - Starting..."

# Wait for Docker daemon to be ready
until docker info > /dev/null 2>&1; do
  echo "Waiting for Docker daemon..."
  sleep 2
done

# Start PostgreSQL container if not running
if ! docker ps --filter "name=terragon_postgres" --filter "status=running" | grep -q terragon_postgres; then
  echo "Starting PostgreSQL container..."
  docker start terragon_postgres 2>/dev/null || {
    echo "PostgreSQL container doesn't exist, creating it..."
    docker run -d \
      --name terragon_postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=terragon \
      -p 5432:5432 \
      -v terragon-postgres-data:/var/lib/postgresql/data \
      postgres:16-alpine
  }
fi

# Start Redis container if not running
if ! docker ps --filter "name=terragon_redis" --filter "status=running" | grep -q terragon_redis; then
  echo "Starting Redis container..."
  docker start terragon_redis 2>/dev/null || {
    echo "Redis container doesn't exist, creating it..."
    docker run -d \
      --name terragon_redis \
      -p 6379:6379 \
      -v terragon-redis-data:/data \
      redis:7-alpine
  }
fi

# Start serverless-redis-http container if not running
if ! docker ps --filter "name=terragon_redis_http" --filter "status=running" | grep -q terragon_redis_http; then
  echo "Starting serverless-redis-http container..."
  docker start terragon_redis_http 2>/dev/null || {
    echo "serverless-redis-http container doesn't exist, creating it..."
    docker run -d \
      --name terragon_redis_http \
      -p 8079:80 \
      -e SRH_MODE=env \
      -e SRH_TOKEN=redis_dev_token \
      -e SRH_CONNECTION_STRING="redis://host.docker.internal:6379" \
      --add-host host.docker.internal:host-gateway \
      hiett/serverless-redis-http:latest
  }
fi

# Wait a moment for services to be ready
sleep 2

# Verify services are ready
echo "Checking service health..."

# PostgreSQL
if pg_isready -h localhost -p 5432 -U postgres > /dev/null 2>&1; then
  echo "✓ PostgreSQL is ready"
else
  echo "⚠️  PostgreSQL is not ready yet"
fi

# Redis
if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
  echo "✓ Redis is ready"
else
  echo "⚠️  Redis is not ready yet"
fi

# Docker daemon (DinD)
if docker info > /dev/null 2>&1; then
  echo "✓ Docker daemon (DinD) is ready"
  docker info --format "  Docker version: {{.ServerVersion}}"
else
  echo "⚠️  Docker daemon (DinD) is not ready"
fi

# Redis HTTP service
if docker ps --filter "name=terragon_redis_http" --filter "status=running" | grep -q terragon_redis_http; then
  echo "✓ Redis HTTP service is ready"
else
  echo "⚠️  Redis HTTP service is not ready"
fi

# Check if node_modules needs update
if [ -f "package.json" ]; then
  if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Dependencies may be out of date. Consider running 'pnpm install'"
  fi
fi

echo "Container ready! Run 'pnpm dev' to start development."
