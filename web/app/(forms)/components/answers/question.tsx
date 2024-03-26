"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useMemo, useState } from "react";
import SelectIndex from "./select-index";
import { FormAnswer } from "@/lib/types/answer";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormAnswersProps } from "./answers-tabs";
import { Field } from "@/lib/types/field";

function processAnswers(answers: FormAnswer[], activeFieldId: string) {
  const fieldAnswersValue = answers.map((answer, index) => {
    const fieldAnswer = answer.data.find(
      (data) => data.fieldId === activeFieldId
    );

    if (!fieldAnswer || fieldAnswer.data.toString().trim() == "") {
      return {
        index,
        data: "Aucune réponse",
        fullname: answer.fullname,
      };
    }

    return {
      index,
      data: fieldAnswer.data,
      fullname: answer.fullname,
    };
  });

  // create a record of answers by data
  const answersByData = fieldAnswersValue.reduce(
    (acc, answer) => {
      if (!answer) return acc;

      if (!acc[answer.data]) {
        acc[answer.data] = [];
      }

      acc[answer.data].push(answer);

      return acc;
    },
    {} as Record<string, typeof fieldAnswersValue>
  );

  return Object.entries(answersByData);
}

export default function Question({ form, answers }: FormAnswersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fields = useMemo(
    () => form.fields.sort((a, b) => a.index - b.index),
    [form.fields]
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const questionIndexParams = searchParams.get("index");
  const questionIndex = questionIndexParams ? parseInt(questionIndexParams) : 0;

  function setActiveIndex(index: number) {
    router.replace(
      pathname + "?" + createQueryString("index", index.toString())
    );
  }

  return fields.length == 0 ||
    questionIndex >= fields.length ||
    questionIndex < 0 ? (
    <div className="text-center text-gray-500 py-4">
      Aucune question n&apos;a été ajoutée à ce formulaire.
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Select
          onValueChange={(value) => setActiveIndex(parseInt(value))}
          value={questionIndex.toString()}
        >
          <SelectTrigger className="max-w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fields
              .filter((f) => f.type != "text")
              .map((field, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {field.question}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <SelectIndex
          activeIndex={questionIndex}
          setActiveIndex={setActiveIndex}
          list={fields}
        />
      </div>
      <ActiveAnswers answers={answers} activeField={fields[questionIndex]} />
    </div>
  );
}

function ActiveAnswers({
  answers,
  activeField,
}: {
  answers: FormAnswer[];
  activeField: Field;
}) {
  const activeAnswers = processAnswers(answers, activeField.id);

  if (activeAnswers.length == 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Cette question n&apos;a reçu aucune réponse.
      </div>
    );
  }

  return activeAnswers.map((answer, index) => (
    <Answer
      key={index}
      text={answer[0]}
      answers={answer[1].filter((a) => a != undefined) as answers}
    />
  ));
}

type answers = { fullname?: string; index: number }[];

function Answer({ text, answers }: { text: string; answers: answers }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span>{text}</span>
        <span className="m-0 text-gray-500">
          <AnswerCombobox
            answers={answers}
            placeholder={
              answers.length + (answers.length === 1 ? " réponse" : " réponses")
            }
          />
        </span>
      </CardHeader>
    </Card>
  );
}

function AnswerCombobox({
  placeholder,
  answers,
}: {
  placeholder: string;
  answers: { fullname?: string; index: number }[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  // Group answers by fullname
  const answersByFullname = answers.reduce(
    (acc, answer) => {
      const fullname = answer.fullname || "Anonyme";

      if (!acc[fullname]) {
        acc[fullname] = [];
      }

      acc[fullname].push(answer);

      return acc;
    },
    {} as Record<string, typeof answers>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une réponse..." />
          <CommandEmpty>Aucune réponse trouvé</CommandEmpty>
          <CommandGroup>
            {Object.entries(answersByFullname).map(([fullname, answers]) => (
              <AnswerItem
                key={fullname}
                fullname={fullname}
                answers={answers}
                onSelect={(value, index) => {
                  const params = new URLSearchParams();
                  params.set("tab", "individual");
                  params.set("index", index.toString());
                  router.push(pathname + "?" + params.toString());
                }}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function AnswerItem({
  fullname,
  answers,
  onSelect,
}: {
  fullname: string;
  answers: answers;
  onSelect: (value: string, index: number) => void;
}) {
  if (answers.length == 1) {
    const answer = answers[0];

    return (
      <CommandItem
        key={answer.index}
        value={fullname}
        onSelect={(value) => onSelect(value, answer.index)}
      >
        {fullname}
      </CommandItem>
    );
  }

  return answers.map((answer, index) => (
    <CommandItem
      key={answer.index}
      value={fullname + index}
      onSelect={(value) => onSelect(value, answer.index)}
    >
      {fullname} - {index + 1}
    </CommandItem>
  ));
}
