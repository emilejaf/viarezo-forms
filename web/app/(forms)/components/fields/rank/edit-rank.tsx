import { QuestionProps } from "../field-types";
import DynamicList from "../../dynamic-list";

export function EditRankQuestion({ field, updateField }: QuestionProps) {
  return (
    <DynamicList
      initialItems={"choices" in field ? field.choices : []}
      updateField={updateField}
    />
  );
}
