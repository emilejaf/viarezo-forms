"use server";

import { mutateAPI } from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function updateModerators(id: string, moderatorLogins: string[]) {
  await mutateAPI("/moderators/" + id, "PATCH", {
    moderatorLogins: moderatorLogins,
  });
  revalidateTag(`${id}/moderators`);
}
