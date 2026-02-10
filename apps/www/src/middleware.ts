import { NextResponse } from "next/server";

// Middleware stub - access code handling removed for self-hosted mode.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
