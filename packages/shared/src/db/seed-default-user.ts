/**
 * Seed script for self-hosted mode.
 * Creates the default user, user_settings, and user_flags rows
 * that are required for the app to function without auth.
 *
 * Usage: npx tsx packages/shared/src/db/seed-default-user.ts
 */
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

// Dynamic import to avoid requiring 'pg' at build time
async function createPool(connectionString: string): Promise<any> {
  try {
    // @ts-expect-error - pg module may not be available at build time
    const pg = await import("pg");
    return new pg.Pool({ connectionString });
  } catch (error) {
    throw new Error(
      "PostgreSQL driver 'pg' is required. Install it with: npm install pg",
    );
  }
}

const DEFAULT_USER_ID = "self-hosted-default-user";

async function seed() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/terragon";

  const pool = await createPool(databaseUrl);
  const db = drizzle(pool, { schema });

  console.log("Seeding default user...");

  // Upsert default user
  await db
    .insert(schema.user)
    .values({
      id: DEFAULT_USER_ID,
      name: "Self-Hosted User",
      email: "admin@localhost",
      emailVerified: true,
      image: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      role: "admin",
      banned: false,
      shadowBanned: false,
    })
    .onConflictDoNothing();

  // Upsert default user_settings
  const existingSettings = await db
    .select()
    .from(schema.userSettings)
    .where(sql`${schema.userSettings.userId} = ${DEFAULT_USER_ID}`)
    .limit(1);

  if (existingSettings.length === 0) {
    await db.insert(schema.userSettings).values({
      userId: DEFAULT_USER_ID,
    });
  }

  // Upsert default user_flags
  const existingFlags = await db
    .select()
    .from(schema.userFlags)
    .where(sql`${schema.userFlags.userId} = ${DEFAULT_USER_ID}`)
    .limit(1);

  if (existingFlags.length === 0) {
    await db.insert(schema.userFlags).values({
      userId: DEFAULT_USER_ID,
      hasSeenOnboarding: true,
      showDebugTools: true,
    });
  }

  console.log("Default user seeded successfully.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
