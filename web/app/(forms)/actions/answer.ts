"use server";

import { mutateAPI } from "@/lib/api";
import { FormType, formTypeHelper } from "@/lib/types/form";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function submitAnswer(
  {
    id,
    type,
    queryParams,
  }: {
    id: string;
    type: FormType;
    queryParams?: Record<string, string>;
  },
  formData: FormData
) {
  // convert FormData to JSON
  const answerList: { fieldId: string; data: string }[] = [];
  const extraData: Record<string, string> = {};
  formData.forEach((value, key) => {
    // nextjs adds some keys to the form data, ignore them
    if (key.startsWith("$")) return;

    if (key.startsWith("+")) {
      extraData[key.slice(1)] = value.toString();
      return;
    }

    answerList.push({ fieldId: key, data: value.toString() });
  });

  // send JSON to server
  await mutateAPI(
    `/${formTypeHelper[type].url}/${id}/answer${queryToString(queryParams)}`,
    "POST",
    {
      data: answerList,
      ...extraData,
    }
  );
  revalidateTag(id);
  redirect(`/${formTypeHelper[type].url}/${id}/success`);
}

function queryToString(query: Record<string, string> | undefined) {
  if (!query) return "";
  return "?" + new URLSearchParams(query).toString();
}
