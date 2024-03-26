export type FieldType = "longq" | "shortq" | "mcq" | "rank" | "slider" | "text";

export interface Field {
  id: string;
  type: FieldType;
  question: string;
  description?: string;
  index: number;
  required: boolean;
}

export interface FieldWithChoices extends Field {
  choices: Choice[];
}

export interface SliderField extends Field {
  min: number | null;
  max: number | null;
  step: number | null;
}

export interface MultipleChoiceQuestionField extends FieldWithChoices {
  multiple: boolean;
  other: boolean;
}

export interface TextField extends Field {
  data: string;
}

export interface Choice {
  id: number;
  data: string;
}
