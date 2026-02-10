import { execSync } from "child_process";
import path from "path";

export type SetupResult = {
  DATABASE_URL: string;
  REDIS_URL: string;
  REDIS_HTTP_URL: string;
  REDIS_HTTP_TOKEN: string;
};

const REDIS_HTTP_TOKEN = "redis_test_token";
const COMPOSE_FILE_DIR = path.join(__dirname, "..");

export async function setupTestContainers(): Promise<SetupResult> {
  console.log("Starting test containers...");
  // Start the containers using the pnpm script (this is idempotent)
  execSync("pnpm docker-up-tests", {
    cwd: COMPOSE_FILE_DIR,
    stdio: "inherit",
  });

  // Connect test containers to the devcontainer network so they're reachable
  // via container hostname (needed for Docker-in-Docker / devcontainer setups)
  for (const container of [
    "terragon_postgres_test",
    "terragon_redis_test",
    "terragon_redis_http_test",
  ]) {
    try {
      execSync(
        `docker network connect dev-env_default ${container} 2>/dev/null`,
        { stdio: "ignore" },
      );
    } catch {
      // Already connected, ignore
    }
  }

  // Clear existing data for clean test state
  try {
    // Clear PostgreSQL database
    execSync(
      'docker exec terragon_postgres_test psql -U postgres -d postgres -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"',
      {
        stdio: "inherit",
      },
    );
    // Clear Redis data
    execSync("docker exec terragon_redis_test redis-cli FLUSHALL", {
      stdio: "inherit",
    });
  } catch (error) {
    console.warn("Failed to clear test data:", error);
  }

  return {
    DATABASE_URL:
      "postgresql://postgres:postgres@terragon_postgres_test:5432/postgres",
    REDIS_URL: "redis://terragon_redis_test:6379",
    REDIS_HTTP_URL: "http://terragon_redis_http_test:80",
    REDIS_HTTP_TOKEN,
  };
}

export async function teardownTestContainers(): Promise<void> {
  // Skip teardown to keep containers running for faster subsequent test runs
  // Data is cleared in setup, so this provides clean test state while maintaining speed
}
