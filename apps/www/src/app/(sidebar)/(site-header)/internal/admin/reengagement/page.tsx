import { getAdminUserOrThrow } from "@/lib/auth-server";

export default async function AdminReengagementPage() {
  await getAdminUserOrThrow();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Re-engagement</h1>
      <p className="text-muted-foreground">
        Not available in self-hosted mode.
      </p>
    </div>
  );
}
