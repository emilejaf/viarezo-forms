import { Answer as DatabaseAnswer } from '@prisma/client';
import { Exclude } from 'class-transformer';

export abstract class AbstractAnswer {
  @Exclude()
  id: number;

  createdAt: Date;

  data: FieldAnswer[];

  constructor(databaseAnswer: DatabaseAnswer) {
    this.createdAt = databaseAnswer.createdAt;
    this.id = databaseAnswer.id;

    const data: Record<string, any> = JSON.parse(databaseAnswer.data);

    this.data = [];
    Object.entries(data).forEach(([fieldId, fieldData]) => {
      this.data.push(new FieldAnswer(fieldId, fieldData));
    });
  }
}
export class FieldAnswer {
  fieldId: string;
  data: string;

  constructor(fieldId: string, data: string) {
    this.fieldId = fieldId;
    this.data = data;
  }
}
