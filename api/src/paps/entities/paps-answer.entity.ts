import { Answer as DatabaseAnswer } from '@prisma/client';
import { AbstractAnswer } from 'src/abstract-forms/entities/answer.entity';

export class PapsAnswer extends AbstractAnswer {
  by?: string;
  fullname?: string;
  papsChoiceId: number;
  position?: number;
  lastScan: Date | null;

  constructor(databaseAnswer: DatabaseAnswer, position?: number) {
    super(databaseAnswer);

    this.by = databaseAnswer.by || undefined;
    this.fullname = databaseAnswer.fullname || undefined;

    // if paps_choice_id is null then we will create a default papsChoice with id -1 (see Paps class definition)
    this.papsChoiceId = databaseAnswer.papsChoiceId || -1;

    this.position = position;

    this.lastScan = databaseAnswer.lastScan;
  }
}
