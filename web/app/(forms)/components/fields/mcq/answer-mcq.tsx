"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultipleChoiceQuestionField } from "@/lib/types/field";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function AnswerMultipleChoiceQuestion({
  field,
  answer,
}: {
  field: MultipleChoiceQuestionField;
  answer?: string | null;
}) {
  return (
    <div className="space-y-2">
      {field.multiple ? (
        <CheckBoxes field={field} answer={answer} />
      ) : (
        <RadioButtons field={field} answer={answer} />
      )}
    </div>
  );
}

// this is in case the owner switch the multiple switch
function parseAnswer(answer?: string | null): string[] {
  if (!answer) return [];

  try {
    const array = JSON.parse(answer);
    if (Array.isArray(array)) return array;
  } catch {}
  return [answer];
}

function CheckBoxes({
  field,
  answer,
}: {
  field: MultipleChoiceQuestionField;
  answer?: string | null;
}) {
  useEffect(() => {
    const parsedAnswer = parseAnswer(answer);
    setChecked(parsedAnswer);

    // if other should be checked
    const other = parsedAnswer.find((answer) =>
      field.choices.every((choice) => choice.data !== answer)
    );

    if (other) {
      setOtherChecked(true);
    }
  }, [answer, field]);

  const [checked, setChecked] = useState<string[]>(parseAnswer(answer));

  const [otherChecked, setOtherChecked] = useState(false);

  return (
    <>
      {field.choices.map((choice) => (
        <div key={field.id + choice.id} className="flex items-center space-x-2">
          <Checkbox
            disabled={answer !== undefined}
            id={field.id + choice.id.toString()}
            value={choice.data}
            checked={checked.includes(choice.data)}
            onCheckedChange={(state) => {
              if (state) {
                setChecked([...checked, choice.data]);
              } else {
                setChecked(checked.filter((c) => c !== choice.data));
              }
            }}
          />
          <Label htmlFor={field.id + choice.id.toString()}>{choice.data}</Label>
        </div>
      ))}
      {field.other && (
        <div className="flex items-center space-x-2">
          <Checkbox
            disabled={answer !== undefined}
            id={field.id + "other"}
            checked={otherChecked}
            onCheckedChange={(state) => {
              setOtherChecked(!!state);
              if (!state) {
                setChecked(
                  checked.filter((c) =>
                    field.choices.some((choice) => choice.data == c)
                  )
                );
              }
            }}
          />
          <Label htmlFor={field.id + "other"}>Autre</Label>
          {otherChecked && (
            <div className="px-2">
              <Input
                disabled={answer !== undefined}
                value={checked.find((c) =>
                  field.choices.every((choice) => choice.data != c)
                )}
                className="absolute max-w-[300px] translate-y-[-50%]"
                type="text"
                placeholder="Répondez ici"
                onInput={(event) => {
                  setChecked([
                    ...checked.filter((c) =>
                      field.choices.some((choice) => choice.data == c)
                    ),
                    event.currentTarget.value,
                  ]);
                }}
              />
            </div>
          )}
        </div>
      )}
      <input type="hidden" name={field.id} value={JSON.stringify(checked)} />
    </>
  );
}

function RadioButtons({
  field,
  answer,
}: {
  field: MultipleChoiceQuestionField;
  answer?: string | null;
}) {
  const [value, setValue] = useState<string | undefined>(
    answer === null ? "" : answer
  );
  const [other, setOther] = useState<string | null>(null);

  useEffect(() => {
    if (answer) {
      if (field.choices.some((choice) => choice.data === answer)) {
        setValue(answer);
      } else {
        setOther(answer);
      }
    } else {
      setValue(answer === null ? "" : answer);
    }
  }, [answer, field.choices]);

  useEffect(() => {
    if (other !== null) {
      setValue(other);
    }
  }, [other]);

  return (
    <RadioGroup
      required={field.required}
      id={field.id}
      name={field.id}
      value={value}
      onValueChange={(newValue) => {
        if (field.choices.some((choice) => choice.data === newValue)) {
          setOther(null);
        } else {
          setOther("");
        }
        setValue(newValue);
      }}
    >
      {field.choices.map((choice) => (
        <div key={field.id + choice.id} className="flex items-center space-x-2">
          <RadioGroupItem value={choice.data} disabled={answer !== undefined} />
          <Label htmlFor={field.id + choice.id.toString()}>{choice.data}</Label>
        </div>
      ))}
      {field.other && (
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={other || ""} disabled={answer !== undefined} />
          <Label htmlFor={field.id + "other"}>Autre</Label>
          {other !== null && (
            <div className="px-2">
              <Input
                disabled={answer !== undefined}
                className="absolute max-w-[300px] translate-y-[-50%]"
                value={other || ""}
                type="text"
                placeholder="Répondez ici"
                onInput={(event) => setOther(event.currentTarget.value)}
              />
            </div>
          )}
        </div>
      )}
    </RadioGroup>
  );
}
