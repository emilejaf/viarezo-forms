import { FieldType } from "@/lib/types/field";
import { EditSliderQuestion, SliderProps } from "./slider/edit-slider";
import {
  EditMultipleChoiceQuestion,
  MultipleChoiceQuestionProps,
} from "./mcq/edit-mcq";
import { EditText, TextProps } from "./text/edit-text";
import { EditRankQuestion } from "./rank/edit-rank";

export type QuestionProps =
  | MultipleChoiceQuestionProps
  | SliderProps
  | TextProps;

export type FieldTypeProps = Record<
  FieldType,
  {
    displayName: string;
    children: React.FC<QuestionProps>;
  }
>;
export const fieldTypes: FieldTypeProps = {
  shortq: {
    displayName: "Question courte",
    children: () => undefined,
  },
  longq: {
    displayName: "Question longue",
    children: () => undefined,
  },
  mcq: {
    displayName: "Choix multiples",
    children: (props) => (
      <EditMultipleChoiceQuestion {...(props as MultipleChoiceQuestionProps)} />
    ),
  },
  rank: {
    displayName: "Classement",
    children: EditRankQuestion,
  },
  slider: {
    displayName: "Curseur",
    children: (props) => <EditSliderQuestion {...(props as SliderProps)} />,
  },
  text: {
    displayName: "Texte",
    children: (props) => <EditText {...(props as TextProps)} />,
  },
};
