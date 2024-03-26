import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldType } from "@/lib/types/field";
import { FieldAnswer } from "@/lib/types/answer";
import SummaryLongQuestion from "../fields/longq/summary-longq";
import SummaryMultipleChoiceQuestion from "../fields/mcq/summary-mcq";
import SummaryShortQuestion from "../fields/shortq/summary-shortq";
import SummarySlider from "../fields/slider/summary-slider";
import { FormAnswersProps } from "./answers-tabs";

export default function Summary({ form, answers }: FormAnswersProps) {
  if (form.fields.length === 0)
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune question n&apos;a été ajoutée à ce formulaire.
      </div>
    );

  return (
    <div className="space-y-4">
      {form.fields
        .sort((a, b) => a.index - b.index)
        .filter((field) => field.type !== "text")
        .map((field) => (
          <FieldSummary
            key={field.id}
            field={field}
            answers={answers.map((answer) =>
              answer.data.find((data) => data.fieldId === field.id)
            )}
          />
        ))}
    </div>
  );
}

export interface FieldSummaryProps {
  field: Field;
  answers: (FieldAnswer | undefined)[];
}

const fieldSummaries: Record<
  FieldType,
  React.FC<FieldSummaryProps> | undefined
> = {
  longq: SummaryLongQuestion,
  mcq: SummaryMultipleChoiceQuestion,
  rank: undefined,
  shortq: SummaryShortQuestion,
  slider: SummarySlider,
  text: undefined,
};

function FieldSummary({ field, answers }: FieldSummaryProps) {
  const numberOfAnswers = answers.filter(
    (answer) => answer != undefined && answer.data.toString().trim() !== ""
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{field.question}</CardTitle>
        <CardDescription>
          {numberOfAnswers == 1 ? "Une réponse" : numberOfAnswers + " réponses"}
        </CardDescription>
      </CardHeader>
      {numberOfAnswers > 0 && fieldSummaries[field.type] != undefined && (
        <CardContent>
          {(fieldSummaries[field.type] as React.FC<FieldSummaryProps>)({
            field,
            answers,
          })}
        </CardContent>
      )}
    </Card>
  );
}
