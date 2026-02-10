"use server";

import { db } from "@/lib/db";
import { adminOnly } from "@/lib/auth-server";
import { User } from "@terragon/shared";
import { Resend } from "resend";
import { env } from "@terragon/env/apps-www";
import { OnboardingCompletionReminderEmail } from "@terragon/transactional/emails/onboarding-completion-reminder";
import {
  getEligibleOnboardingCompletionRecipients,
  recordOnboardingCompletionEmail,
} from "@terragon/shared/model/onboarding-completion-emails";

// Access code / waitlist email functions removed for self-hosted deployment.
// sendOnboardingEmail, getReengagementPreview, and sendReengagementEmails
// have been stubbed out.

export const sendOnboardingEmail = adminOnly(async function sendOnboardingEmail(
  _adminUser: User,
  _email: string,
) {
  throw new Error(
    "sendOnboardingEmail is disabled: access code flow removed for self-hosted deployment",
  );
});

export const getReengagementPreview = adminOnly(
  async function getReengagementPreview() {
    return { recipients: [], count: 0 };
  },
);

export const sendReengagementEmails = adminOnly(async (_adminUser: User) => {
  return { success: true, sent: 0, failed: 0, errors: [] as string[] };
});

export const getOnboardingCompletionPreview = adminOnly(async () => {
  console.log("getOnboardingCompletionPreview");
  const eligibleUsers = await getEligibleOnboardingCompletionRecipients({
    db,
  });
  return {
    recipients: eligibleUsers,
    count: eligibleUsers.length,
  };
});

export const sendOnboardingCompletionEmails = adminOnly(
  async (adminUser: User) => {
    console.log("sendOnboardingCompletionEmails");
    const eligibleUsers = await getEligibleOnboardingCompletionRecipients({
      db,
    });
    if (eligibleUsers.length === 0) {
      return {
        success: true,
        sent: 0,
        failed: 0,
        errors: [],
      };
    }

    const resend = new Resend(env.RESEND_API_KEY ?? "DUMMY_KEY");
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
        : env.BETTER_AUTH_URL;

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send emails in batches to avoid rate limiting
    for (const user of eligibleUsers) {
      try {
        const dashboardLink = `${baseUrl}/`;

        const result = await resend.emails.send({
          from: "The Terragon Team <onboarding@mail.terragonlabs.com>",
          to: user.email,
          replyTo: "support@terragonlabs.com",
          subject: "Forget something?",
          react: (
            <OnboardingCompletionReminderEmail dashboardLink={dashboardLink} />
          ),
        });

        if (result.error) {
          results.failed++;
          results.errors.push(
            `Failed to send to ${user.email}: ${result.error.message}`,
          );
        } else {
          // Record that we sent the email
          await recordOnboardingCompletionEmail({
            db,
            userId: user.id,
            email: user.email,
            sentByUserId: adminUser.id,
          });
          results.sent++;
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to send to ${user.email}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }

    return {
      success: true,
      ...results,
    };
  },
);
