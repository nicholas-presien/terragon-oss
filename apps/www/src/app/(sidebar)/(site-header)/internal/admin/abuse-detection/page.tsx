import { getAdminUserOrThrow } from "@/lib/auth-server";

export default async function AbuseDetectionPage() {
  await getAdminUserOrThrow();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Abuse Detection</h1>
      <p className="text-muted-foreground">
        Not available in self-hosted mode.
      </p>
    </div>
  );
}
