"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AbstractAnswer } from "@/lib/types/answer";
import { AbstractForm } from "@/lib/types/form";
import Summary from "./summary";
import Question from "./question";
import Individual from "./individual";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AllowAnswers from "./allow-answers";

export interface FormAnswersProps {
  form: AbstractForm;
  answers: AbstractAnswer[];
  hideAllowAnswers?: boolean;
}

export default function AnswersTabs({ form, answers, hideAllowAnswers }: FormAnswersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Tabs
      value={searchParams.get("tab") || "summary"}
      className="space-y-4"
      onValueChange={(tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        params.set("index", "0");
        router.replace(pathname + "?" + params.toString());
      }}
    >
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="individual">Individuel</TabsTrigger>
        </TabsList>
        { !hideAllowAnswers && <AllowAnswers form={form} /> }
      </div>
      <TabsContent value="summary">
        <Summary form={form} answers={answers} />
      </TabsContent>
      <TabsContent value="question">
        <Question form={form} answers={answers} />
      </TabsContent>
      <TabsContent value="individual">
        <Individual form={form} answers={answers} />
      </TabsContent>
    </Tabs>
  );
}
