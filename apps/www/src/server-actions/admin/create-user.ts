"use server";

import { adminOnlyAction } from "@/lib/auth-server";
import { db } from "@/lib/db";
import { user } from "@terragon/shared/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "admin"]).default("user"),
});

export const createUserAction = adminOnlyAction(
  async (adminUser, input: z.infer<typeof createUserSchema>) => {
    // Validate input
    const validated = createUserSchema.parse(input);

    // Check if user with this email already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, validated.email),
    });

    if (existingUser) {
      throw new Error(`User with email ${validated.email} already exists`);
    }

    // Generate a random UUID for the user ID
    const userId = crypto.randomUUID();

    // Create the user
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        email: validated.email,
        name: validated.name,
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: validated.role,
      })
      .returning();

    return {
      success: true,
      user: newUser,
    };
  },
  {
    errorMessage: "Failed to create user",
  },
);
