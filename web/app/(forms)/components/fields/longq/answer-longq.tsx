import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/lib/types/field";

export function AnswerLongQuestion({
  field: { required, id },
  answer,
}: {
  field: Field;
  answer?: string | null;
}) {
  return (
    <Textarea
      id={id}
      name={id}
      required={required}
      className="h-32"
      disabled={answer !== undefined}
      defaultValue={answer === null ? "" : answer}
    />
  );
}
