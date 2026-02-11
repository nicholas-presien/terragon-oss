export async function signOut() {
  await fetch("/api/auth/signout", { method: "POST" });
  window.location.href = "/";
}

export function useSession() {
  return { data: null, isPending: false };
}
