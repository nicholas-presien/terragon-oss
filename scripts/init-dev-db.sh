#!/bin/bash
# Initialize development database with schema and default user

set -e

echo "🔧 Initializing development database..."

# Change to packages/shared directory
cd "$(dirname "$0")/../packages/shared"

# Generate and apply migrations
echo "📝 Generating database migrations..."
pnpm drizzle-kit generate

echo "🗄️  Applying migrations to database..."
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -f drizzle/0000_wandering_changeling.sql > /dev/null 2>&1 || {
  echo "⚠️  Migrations may have already been applied, continuing..."
}

# Insert default self-hosted user
echo "👤 Creating default self-hosted user..."
PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -c "
INSERT INTO \"user\" (id, name, email, email_verified, image, created_at, updated_at, role, banned, ban_reason, ban_expires, shadow_banned)
VALUES ('self-hosted-default-user', 'Self-Hosted User', 'admin@localhost', true, null, '2024-01-01', '2024-01-01', 'admin', false, null, null, false)
ON CONFLICT (id) DO NOTHING;
" > /dev/null 2>&1

echo "✅ Database initialized successfully!"
echo ""
echo "You can now run 'pnpm dev' to start the development server"
