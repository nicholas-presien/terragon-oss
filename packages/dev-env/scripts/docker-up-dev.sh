#!/bin/bash
set -e

# Check if the terragon containers are already running
if docker ps --format '{{.Names}}' | grep -q "terragon_postgres_dev" && \
   docker ps --format '{{.Names}}' | grep -q "terragon_redis_dev" && \
   docker ps --format '{{.Names}}' | grep -q "terragon_redis_http_dev"; then
  echo "✓ Terragon development containers are already running"
  exit 0
fi

# If not running, start them
echo "Starting Terragon development containers..."
docker compose --project-name=terragon-db up --remove-orphans -d
