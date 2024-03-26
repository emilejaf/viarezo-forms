import { Input } from "@/components/ui/input";
import { Field } from "@/lib/types/field";

export function AnswerShortQuestion({
  field: { id, required },
  answer,
}: {
  field: Field;
  answer?: string | null;
}) {


  return (
    <Input
      id={id}
      name={id}
      type="text"
      required={required}
      disabled={answer !== undefined}
      value={answer === null ? "" : answer}
    />
  );
}
