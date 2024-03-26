"use server";

import { mutateAPI } from "@/lib/api";
import { Voter } from "@/lib/types/voters";
import { revalidateTag } from "next/cache";

export async function createVoter(voteId: string) {
  await mutateAPI(`/votes/${voteId}/voters`, "POST");
  revalidateTag(`voters/${voteId}`);
}

export async function updateVoter(
  voteId: string,
  voterId: number,
  payload: Partial<Voter>
) {
  await mutateAPI(`/votes/${voteId}/voters/${voterId}`, "PATCH", payload);
  revalidateTag(`voters/${voteId}`);
}

export async function deleteVoter(voteId: string, voterId: number) {
  await mutateAPI(`/votes/${voteId}/voters/${voterId}`, "DELETE");
  revalidateTag(`voters/${voteId}`);
}
