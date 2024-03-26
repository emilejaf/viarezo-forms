import { Slider } from "@/components/ui/slider";
import { SliderField } from "@/lib/types/field";

export function AnswerSliderQuestion({
  field,
  answer,
}: {
  field: SliderField;
  answer?: string | null;
}) {
  return (
    <Slider
      id={field.id}
      name={field.id}
      min={field.min != null ? field.min : 0}
      max={field.max != null ? field.max : 100}
      step={field.step != null ? field.step : 1}
      disabled={answer !== undefined}
      value={answer != undefined ? [parseInt(answer)] : undefined}
    />
  );
}
