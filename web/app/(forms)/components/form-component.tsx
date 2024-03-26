import { FieldAnswer } from "@/lib/types/answer";
import {
  FieldType,
  Field,
  FieldWithChoices,
  SliderField,
  TextField,
  MultipleChoiceQuestionField,
} from "@/lib/types/field";
import { AbstractForm } from "@/lib/types/form";
import { AnswerShortQuestion } from "./fields/shortq/answer-shortq";
import { AnswerMultipleChoiceQuestion } from "./fields/mcq/answer-mcq";
import { AnswerLongQuestion } from "./fields/longq/answer-longq";
import { AnswerRankQuestion } from "./fields/rank/answer-rank";
import { AnswerSliderQuestion } from "./fields/slider/answer-slider";
import renderRichText from "@/lib/render-rich-text";

const answerableFields: Record<
  FieldType,
  React.FC<{ field: Field; answer?: string | null }>
> = {
  shortq: AnswerShortQuestion,
  longq: AnswerLongQuestion,
  mcq: ({ field, answer }) => (
    <AnswerMultipleChoiceQuestion
      field={field as MultipleChoiceQuestionField}
      answer={answer}
    />
  ),
  rank: ({ field, answer }) => (
    <AnswerRankQuestion field={field as FieldWithChoices} answer={answer} />
  ),
  slider: ({ field, answer }) => (
    <AnswerSliderQuestion field={field as SliderField} answer={answer} />
  ),
  text: ({ field }) => renderRichText((field as TextField).data),
};

export default function FormComponent({
  form,
  answers,
}: {
  form: AbstractForm;
  answers?: FieldAnswer[];
}) {
  return (
    <div className="space-y-8">
      {form.fields
        .sort((a, b) => a.index - b.index)
        .map((field) => {
          const answer = answers
            ? answers?.find((a) => a.fieldId == field.id)?.data || null
            : undefined;
          return (
            <div key={field.id} className="space-y-4">
              {field.type != "text" && (
                <div>
                  <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    {field.question}
                  </h3>
                  {field.description && (
                    <p className="leading-7">{field.description}</p>
                  )}
                </div>
              )}
              {answerableFields[field.type]({ field, answer })}
            </div>
          );
        })}
    </div>
  );
}
