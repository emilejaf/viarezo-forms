import { Answer as DatabaseAnswer } from '@prisma/client';
import { AbstractAnswer } from 'src/abstract-forms/entities/answer.entity';

export class FormAnswer extends AbstractAnswer {
  // can be undefined if the user is anonymous
  by?: string;
  fullname?: string;

  constructor(databaseAnswer: DatabaseAnswer) {
    super(databaseAnswer);

    this.by = databaseAnswer.by || undefined;
    this.fullname = databaseAnswer.fullname || undefined;
  }
}
