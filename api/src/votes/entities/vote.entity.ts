import { Form as PrismaForm } from '@prisma/client';
import {
  AbstractForm,
  FormType,
  InvalidFormDataError,
  PrismaFormWithFields,
} from 'src/abstract-forms/entities/form.entity';

export class Vote extends AbstractForm {
  editable: boolean;

  type: FormType = FormType.VOTE;

  constructor(form: PrismaForm | PrismaFormWithFields, owner?: string | null) {
    super(form, owner);

    // check if form is a secure vote form
    if (form.secured == null || form.editable == null) {
      throw new InvalidFormDataError(FormType.VOTE);
    }

    this.editable = form.editable;
  }
}
