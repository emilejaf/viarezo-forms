import { Form as PrismaForm } from '@prisma/client';
import {
  AbstractForm,
  FormType,
  AnswerableForm,
  PrismaFormWithFields,
} from 'src/abstract-forms/entities/form.entity';
import { AccessType } from 'src/access/access';

export class Form extends AbstractForm {
  access: AccessType;
  accessMeta?: string;
  anonym: boolean;
  uniqueAnswer: boolean;
  type: FormType = FormType.FORM;

  constructor(form: PrismaForm | PrismaFormWithFields, owner?: string | null) {
    super(form, owner);

    // check if form is a base form
    this.accessMeta = form.accessMeta || undefined;

    this.anonym = form.anonym || false;
    this.uniqueAnswer = form.uniqueAnswer || false;

    if (
      !form.access ||
      !Object.values(AccessType).some(
        (access: string) => access === form.access,
      )
    ) {
      // this should not occur since input data is validated by dto
      throw new Error(`Invalid form access: ${form.access}`);
    }

    // form access is valid
    this.access = AccessType[form.access as keyof typeof AccessType];
  }

  toAnswerableForm(): AnswerableForm {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessMeta, owner, ...answerableForm } = this;
    return answerableForm as Omit<this, 'accessMeta' | 'owner'>;
  }
}
