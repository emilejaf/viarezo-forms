import { Form as PrismaForm } from '@prisma/client';
import {
  AbstractForm,
  FormType,
  InvalidFormDataError,
  AnswerableForm,
  PrismaFormWithFields,
} from 'src/abstract-forms/entities/form.entity';
import { AccessType } from 'src/access/access';

export const LEGACY_PAPS_CHOICE_ID = -1;

export class Paps extends AbstractForm {
  access: AccessType;
  accessMeta?: string;
  start: Date | null; // papsStart in database schema
  type: FormType = FormType.PAPS;
  choices: PapsChoice[];

  constructor(
    form: PrismaForm | PrismaFormWithFields,
    owner?: string | null,
    papsChoices?: PapsChoice[],
  ) {
    super(form, owner);

    // check if form is a paps form
    if (!form.paps) {
      throw new InvalidFormDataError(FormType.PAPS);
    }

    this.accessMeta = form.accessMeta || undefined;

    if (
      !form.access ||
      !Object.values(AccessType).some(
        (access: string) => access === form.access,
      )
    ) {
      // this should not occur since input data is validated by dto
      throw new Error(`Invalid form access: ${form.access}`);
    }

    this.access = AccessType[form.access as keyof typeof AccessType];

    this.choices = papsChoices || [];

    this.start = form.papsStart;
  }

  toAnswerableForm(): AnswerableForm {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessMeta, owner, ...answerableForm } = this;
    return answerableForm as Omit<this, 'accessMeta' | 'owner'>;
  }
}

// two types are called PapsChoice (this one and the one in the database schema)
export interface PapsChoice {
  id: number;
  // name is undefined if there is only one choice
  name?: string;
  size: number;

  answersCount: number;
}
