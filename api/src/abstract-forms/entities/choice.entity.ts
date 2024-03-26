import { Choice as PrismaChoice } from '@prisma/client';

export class Choice {
  id: number;
  data: string;

  constructor(choice: PrismaChoice) {
    this.id = choice.id;
    this.data = choice.data || '';
  }
}
