"use server";

import { mutateAPI, queryAPI } from "@/lib/api";

export async function checkAccess({
  id,
  login,
}: {
  id: string;
  login: string;
}) {
  const result = await mutateAPI(`/paps/${id}/check/${login}`, "POST");

  if (!result.ok) {
    return { result: null };
  } else {
    return { result: JSON.parse(result.payload).result };
  }
}
