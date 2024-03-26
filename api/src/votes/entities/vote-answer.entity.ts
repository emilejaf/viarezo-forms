import { Answer as DatabaseAnswer } from '@prisma/client';
import { AbstractAnswer } from 'src/abstract-forms/entities/answer.entity';

export class VoteAnswer extends AbstractAnswer {
  public signatureVerified: boolean;

  constructor(databaseAnswer: DatabaseAnswer, signatureVerified?: boolean) {
    super(databaseAnswer);

    this.signatureVerified = signatureVerified || false;
  }
}
