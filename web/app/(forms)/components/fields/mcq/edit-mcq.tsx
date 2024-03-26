import { Switch } from "@/components/ui/switch";
import DynamicList from "../../dynamic-list";
import { Label } from "@/components/ui/label";
import { MultipleChoiceQuestionField } from "@/lib/types/field";
import { DeepPartial } from "@/lib/types/form";

export interface MultipleChoiceQuestionProps {
  field: MultipleChoiceQuestionField;
  updateField: (field: DeepPartial<MultipleChoiceQuestionField>) => void;
}

export function EditMultipleChoiceQuestion({
  field,
  updateField,
}: MultipleChoiceQuestionProps) {
  return (
    <DynamicList
      initialItems={"choices" in field ? field.choices : []}
      updateField={updateField}
    >
      <div className="flex items-center space-x-2">
        <Switch
          id="multiple"
          checked={field.multiple}
          onCheckedChange={(checked) =>
            updateField({ multiple: checked, other: field.other })
          }
        />
        <Label htmlFor="multiple">Multiple</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="other"
          checked={field.other}
          onCheckedChange={(checked) =>
            updateField({ multiple: field.multiple, other: checked })
          }
        />
        <Label htmlFor="other">Champ autre</Label>
      </div>
    </DynamicList>
  );
}
