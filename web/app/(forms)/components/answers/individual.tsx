"use client";

import { useCallback } from "react";
import SelectIndex from "./select-index";
import FormComponent from "../form-component";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormAnswersProps } from "./answers-tabs";
import { AbstractAnswer } from "@/lib/types/answer";

function fullname(answers: AbstractAnswer): string {
  return (
    ("fullname" in answers
      ? (answers.fullname as string | undefined)
      : undefined) || "Anonyme"
  );
}

export default function Individual({ form, answers }: FormAnswersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const answerIndexParams = searchParams.get("index");
  const answerIndex = answerIndexParams ? parseInt(answerIndexParams) : 0;

  return answers.length == 0 ||
    answerIndex >= answers.length ||
    answerIndex < 0 ? (
    <div className="text-center text-gray-500 py-4">
      Aucune réponse pour ce formulaire.
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span>
          {fullname(answers[answerIndex])
            ? `Réponse de ${fullname(answers[answerIndex])}`
            : ""}
        </span>
        <SelectIndex
          activeIndex={answerIndex}
          setActiveIndex={(index) => {
            router.replace(
              pathname + "?" + createQueryString("index", index.toString()),
            );
          }}
          list={answers}
        />
      </div>
      <FormComponent form={form} answers={answers[answerIndex].data} />
    </div>
  );
}
