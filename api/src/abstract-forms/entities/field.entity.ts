import {
  Choice as PrismaChoice,
  Field as PrismaField,
  FieldType,
} from '@prisma/client';
import { Choice } from './choice.entity';

type PrismaFieldWithChoices = PrismaField & { choices: PrismaChoice[] };

export abstract class AbstractField {
  abstract type: FieldType;

  id: string;
  question: string;
  description?: string;
  index: number;
  required: boolean;

  constructor(field: PrismaField) {
    this.id = field.id;
    this.question = field.question?.toString() || '';
    this.description = field.description || undefined;
    this.index = field.index;
    this.required = field.required;
  }

  static New(field: PrismaFieldWithChoices): AbstractField {
    // there must be a better way to do it.
    switch (field.type) {
      case 'longq':
        return new LongQuestionField(field);
      case 'shortq':
        return new ShortQuestionField(field);
      case 'mcq':
        return new MultipleChoiceQuestionField(field);
      case 'rank':
        return new RankQuestionField(field);
      case 'slider':
        return new SliderField(field);
      case 'text':
        return new TextField(field);
      case 'drop':
        return new DropdownField(field);
      default:
        throw new Error(`${field.type} is an invalid field type`);
    }
  }
}

export class LongQuestionField extends AbstractField {
  type = FieldType.longq;

  constructor(field: PrismaField) {
    super(field);
  }
}

export class ShortQuestionField extends AbstractField {
  type = FieldType.shortq;

  constructor(field: PrismaField) {
    super(field);
  }
}

export class MultipleChoiceQuestionField extends AbstractField {
  type = FieldType.mcq;

  multiple: boolean;
  other: boolean;

  choices: Choice[];

  constructor(field: PrismaFieldWithChoices) {
    super(field);
    this.choices = field.choices.map((choice) => new Choice(choice));

    const metaJSON: { multiple?: boolean; other?: boolean } = field.meta
      ? JSON.parse(field.meta)
      : {};

    this.multiple = metaJSON.multiple || false;
    this.other = metaJSON.other || false;
  }
}

export class RankQuestionField extends AbstractField {
  type = FieldType.rank;

  choices: Choice[];

  constructor(field: PrismaFieldWithChoices) {
    super(field);
    this.choices = field.choices.map((choice) => new Choice(choice));
  }
}

export class SliderField extends AbstractField {
  type = FieldType.slider;

  min: number | null;
  max: number | null;
  step: number | null;

  private findChoiceById(choices: PrismaChoice[], index: number) {
    const data = choices[index]?.data;
    return data != null ? parseInt(data) : null;
  }

  constructor(field: PrismaFieldWithChoices) {
    super(field);
    this.min = this.findChoiceById(field.choices, 0);
    this.max = this.findChoiceById(field.choices, 1);
    this.step = this.findChoiceById(field.choices, 2);
  }
}

export class TextField extends AbstractField {
  type = FieldType.text;

  data: string;

  constructor(field: PrismaField) {
    super(field);

    // this store the rich text editor data
    // it is stored in the db in the question field
    this.data = field.question?.toString() || '';
  }
}

// this is currently not used
export class DropdownField extends AbstractField {
  type = FieldType.drop;

  choices: Choice[];

  constructor(field: PrismaFieldWithChoices) {
    super(field);
    this.choices = field.choices.map((choice) => new Choice(choice));
  }
}
