import { redirect } from "next/navigation";

// Access code / waitlist flow removed for self-hosted deployment.
// This page now simply redirects to the dashboard.
export default async function InvitedPage() {
  redirect("/dashboard");
}
