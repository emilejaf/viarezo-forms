import {
  Choice as PrismaChoice,
  Field as PrismaField,
  Form as PrismaForm,
} from '@prisma/client';
import { AbstractField } from './field.entity';

export type PrismaFormWithFields = PrismaForm & {
  fields: (PrismaField & { choices: PrismaChoice[] })[];
};

export type AnswerableForm = Omit<AbstractForm, 'accessMeta' | 'owner'>;

export abstract class AbstractForm {
  id: string;
  login: string;
  title: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  backgroundUrl?: string;
  logoUrl?: string;
  fields?: AbstractField[];

  owner?: string | null;

  abstract type: FormType;

  constructor(form: PrismaForm | PrismaFormWithFields, owner?: string | null) {
    this.id = form.id;
    this.login = form.login;
    this.title = form.title;
    this.description = form.description || undefined;
    this.active = form.active || false;
    this.createdAt = form.createdAt;
    this.updatedAt = form.updatedAt;
    this.backgroundUrl = form.backgroundUrl || undefined;
    this.logoUrl = form.logoUrl || undefined;

    if ('fields' in form) {
      this.fields = form.fields.map((field) => AbstractField.New(field));
    }

    this.owner = owner;
  }

  toAnswerableForm(): AnswerableForm {
    // TODO : this seems to be useless because owner is a boolean and not the login of the owner...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { owner, ...answerableForm } = this;
    return answerableForm as Omit<this, 'owner'>;
  }
}

export class InvalidFormDataError extends Error {
  constructor(formType: FormType) {
    super(`Invalid form data for form type: ${formType.toString()}`);
    this.name = 'InvalidFormDataError';
  }
}

export enum FormType {
  FORM = 'FORM',
  PAPS = 'PAPS',
  VOTE = 'VOTE',
}

export class UnknownFormTypeError extends Error {
  constructor() {
    super(
      `type must be one of the following values: ${Object.values(FormType).join(
        ', ',
      )}`,
    );
    this.name = 'UnknownFormTypeError';
  }
}
