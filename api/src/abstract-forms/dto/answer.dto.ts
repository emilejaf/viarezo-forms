import { FieldType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { AbstractField } from '../entities/field.entity';

export class FieldAnswerDto {
  @IsString()
  fieldId: string;

  @IsString()
  data: string;
}

export abstract class AbstractAnswerDto {
  @ValidateNested({ each: true })
  @Type(() => FieldAnswerDto)
  data: FieldAnswerDto[];

  async validateRequiredFields(fields: AbstractField[]) {
    const fieldsTypes: Record<string, FieldType> = {};
    fields.forEach((field) => {
      fieldsTypes[field.id] = field.type;
    });

    // check for required fields
    const requiredFields = fields.filter((field) => field.required);
    const requiredFieldsIds = requiredFields.map((field) => field.id);
    const missingRequiredFields = requiredFieldsIds.filter(
      (fieldId) => !this.data.some((answer) => answer.fieldId === fieldId),
    );
    return missingRequiredFields.length == 0;
  }

  public toPrisma() {
    const data: Record<string, string> = {};

    this.data.forEach((answer) => {
      data[answer.fieldId] = answer.data;
    });

    return JSON.stringify(data);
  }
}
