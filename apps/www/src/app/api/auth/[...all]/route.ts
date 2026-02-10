import { NextResponse } from "next/server";

// Auth routes stub - Better Auth has been removed for self-hosted mode.
export async function GET() {
  return NextResponse.json(
    { error: "Auth is not available in self-hosted mode" },
    { status: 404 },
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Auth is not available in self-hosted mode" },
    { status: 404 },
  );
}
