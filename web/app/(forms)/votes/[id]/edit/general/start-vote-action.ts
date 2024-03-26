"use server";

import { mutateAPI } from "@/lib/api";
import { redirect } from "next/navigation";

export async function startVoteAction(id: string) {
  const result = await mutateAPI(`/votes/${id}/start`, "POST");

  if (result.ok) {
    redirect(`/votes/${id}/started?now`);
  }

  return result;
}
