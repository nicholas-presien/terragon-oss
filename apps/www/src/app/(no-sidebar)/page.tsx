import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const maxDuration = 800;

export const metadata: Metadata = {
  title: "Terragon",
};

export default async function Home() {
  redirect("/dashboard");
}
