import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderField } from "@/lib/types/field";

export interface SliderProps {
  field: SliderField;
  updateField: (field: Partial<SliderField>) => void;
}

export function EditSliderQuestion({ field, updateField }: SliderProps) {
  return (
    <div className="flex justify-between">
      <div className="space-y-2">
        <Label htmlFor="from">De</Label>
        <Input
          id="from"
          name="from"
          value={field.min != null ? field.min : ""}
          onChange={(e) => {
            const value = e.target.value;
            const min = value.trim() != "" ? parseInt(value) : null;

            updateField({ min });
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="to">à</Label>
        <Input
          id="to"
          name="to"
          value={field.max != null ? field.max : ""}
          onChange={(e) => {
            const value = e.target.value;
            const max = value.trim() != "" ? parseInt(value) : null;
            updateField({ max });
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="step">Pas</Label>
        <Input
          id="step"
          name="step"
          value={field.step != null ? field.step : ""}
          onChange={(e) => {
            const value = e.target.value;
            const step = value.trim() != "" ? parseInt(value) : null;
            updateField({ step });
          }}
        />
      </div>
    </div>
  );
}
