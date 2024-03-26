"use server";

import { mutateAPI } from "@/lib/api";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function depaps(id: string) {
  const result = await mutateAPI(`/paps/${id}/answer`, "DELETE");
  revalidateTag(`paps/${id}`);

  if (result.ok) {
    redirect(`/paps/${id}`);
  }
}
