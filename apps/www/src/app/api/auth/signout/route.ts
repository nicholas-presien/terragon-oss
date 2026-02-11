import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, getSessionCookieName } from "@/lib/auth-utils";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  // Clear session cookies (both variants)
  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
  cookieStore.set(getSessionCookieName(), "", clearOptions);
  cookieStore.set("better-auth.session_token", "", { path: "/", maxAge: 0 });
  cookieStore.set("__Secure-better-auth.session_token", "", {
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
