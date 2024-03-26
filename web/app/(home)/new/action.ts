"use server";

import { mutateAPI } from "@/lib/api";
import { FormType, formTypeHelper } from "@/lib/types/form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createForm(formType: FormType) {
  const result = await mutateAPI(`/${formTypeHelper[formType].url}`, "POST");
  const payload = JSON.parse(result.payload);

  if (result.ok) {
    revalidatePath("/", "page");
    redirect(`/${formTypeHelper[formType].url}/${payload.id}/edit`);
  } else {
    throw new Error("Impossible de créer le formulaire");
  }
}
