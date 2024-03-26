"use server";

import { mutateAPI } from "@/lib/api";
import {
  AbstractForm,
  DeepPartial,
  FormType,
  formTypeHelper,
} from "@/lib/types/form";
import { revalidateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateFormAction<T extends AbstractForm>(
  id: string,
  type: FormType,
  partialForm: DeepPartial<T>
) {
  const result = await mutateAPI(
    `/${formTypeHelper[type].url}/${id}/edit`,
    "PATCH",
    partialForm
  );

  revalidateTag(id);

  return result;
}

export async function deleteFormAction(id: string, type: FormType) {
  const result = await mutateAPI(
    `/${formTypeHelper[type].url}/${id}/edit`,
    "DELETE"
  );
  revalidatePath("/");
  if (result.ok) {
    redirect("/");
  }

  return result;
}
