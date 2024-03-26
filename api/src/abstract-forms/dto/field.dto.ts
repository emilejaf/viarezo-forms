import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { FieldType, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { ChoiceDto } from './choice.dto';

export class FieldDto {
  type: FieldType | undefined = undefined;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  index?: number;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  // for typescript, we need to specify the type of choices
  declare choices?: ChoiceDto[];

  buildPrismaCreateField(): Prisma.FieldCreateWithoutFormInput {
    if (!this.type)
      throw new Error(`Field type is undefined for field ${this.id}`);

    return {
      type: this.type,
      question: Buffer.from(this.question || ''),
      description: this.description,
      index: this.index,
      required: this.required,
      choices: this.choices
        ? {
            createMany: {
              data: this.choices.filter((choice) => choice.id == null),
            },
          }
        : undefined,
    };
  }

  buildPrismaUpdateField(formId: string): Prisma.FieldUpdateWithoutFormInput {
    return {
      id: this.id,
      type: this.type,
      question: this.question ? Buffer.from(this.question) : undefined,
      description: this.description,
      index: this.index,
      required: this.required,
      choices: this.choices
        ? {
            deleteMany: {
              formId: formId,
              fieldId: this.id,
              id: {
                notIn: this.choices
                  .filter((choice) => choice.id != null)
                  .map((choice) => choice.id as number),
              },
            },

            createMany: {
              data: this.choices.filter((choice) => choice.id == null),
            },
            update: this.choices
              .filter((choice) => choice.id != null)
              .map((choice) => ({
                where: {
                  id_fieldId_formId: {
                    formId: formId,
                    fieldId: this.id as string,
                    id: choice.id as number,
                  },
                },
                data: choice,
              })),
          }
        : undefined,
    };
  }
}

export class LongQuestionDto extends FieldDto {
  type = FieldType.longq;
}

export class ShortQuestionDto extends FieldDto {
  type = FieldType.shortq;
}

export class MultipleChoiceQuestionDto extends FieldDto {
  type = FieldType.mcq;

  @IsOptional()
  @IsBoolean()
  multiple?: boolean;

  @IsOptional()
  @IsBoolean()
  other?: boolean;

  @Type(() => ChoiceDto)
  @ValidateNested({ each: true })
  choices: ChoiceDto[];

  buildPrismaCreateField(): Prisma.FieldCreateWithoutFormInput {
    return {
      ...super.buildPrismaCreateField(),
      meta:
        this.multiple != undefined && this.other != undefined
          ? JSON.stringify({
              multiple: this.multiple,
              other: this.other,
            })
          : undefined,
    };
  }

  buildPrismaUpdateField(formId: string): Prisma.FieldUpdateWithoutFormInput {
    return {
      ...super.buildPrismaUpdateField(formId),
      meta:
        this.multiple != undefined && this.other != undefined
          ? JSON.stringify({
              multiple: this.multiple,
              other: this.other,
            })
          : undefined,
    };
  }
}

export class SliderDto extends FieldDto {
  type = FieldType.slider;

  @IsOptional()
  @ValidateIf((num) => num == null || typeof num == 'number')
  min?: number | null;

  @IsOptional()
  @ValidateIf((num) => num == null || typeof num == 'number')
  max?: number | null;

  @IsOptional()
  @ValidateIf((num) => num == null || typeof num == 'number')
  step?: number | null;

  buildPrismaCreateField(): Prisma.FieldCreateWithoutFormInput {
    return {
      ...super.buildPrismaCreateField(),
      choices: {
        createMany: {
          data: this.buildChoices(),
        },
      },
    };
  }

  buildPrismaUpdateField(formId: string): Prisma.FieldUpdateWithoutFormInput {
    return {
      ...super.buildPrismaUpdateField(formId),
      choices: {
        upsert: this.buildChoices().map((choice) => ({
          create: choice,
          update: choice,
          where: {
            id_fieldId_formId: {
              fieldId: this.id as string,
              formId: formId,
              id: choice.id as number,
            },
          },
        })),
      },
    };
  }

  private buildChoices(): ChoiceDto[] {
    return [
      { id: 1, data: this.min != null ? this.min.toString() : this.min }, // with prisma, we can't create at id 0
      { id: 2, data: this.max != null ? this.max.toString() : this.max },
      { id: 3, data: this.step != null ? this.step.toString() : this.step },
    ];
  }
}

export class RankDto extends FieldDto {
  type = FieldType.rank;

  @Type(() => ChoiceDto)
  @ValidateNested({ each: true })
  choices: ChoiceDto[];
}

export class TextDto extends FieldDto {
  type = FieldType.text;

  // this store the rich text editor data
  // it is stored in the db in the question field
  @IsOptional()
  @IsString()
  data: string | undefined;

  buildPrismaCreateField(): Prisma.FieldCreateWithoutFormInput {
    return {
      ...super.buildPrismaCreateField(),
      question: this.data ? Buffer.from(this.data) : null,
    };
  }

  buildPrismaUpdateField(formId: string): Prisma.FieldUpdateWithoutFormInput {
    return {
      ...super.buildPrismaUpdateField(formId),
      question: this.data ? Buffer.from(this.data) : null,
    };
  }
}

// it is unused currently that was maybe a project in the legacy code to implement dropdown
// this would be nice to implement in the future
export class DropdownDto extends FieldDto {
  type = FieldType.drop;
}

export const subTypes = [
  { value: FieldDto, name: undefined }, // default value
  { value: LongQuestionDto, name: FieldType.longq },
  { value: ShortQuestionDto, name: FieldType.shortq },
  { value: MultipleChoiceQuestionDto, name: FieldType.mcq },
  { value: DropdownDto, name: FieldType.drop },
  { value: SliderDto, name: FieldType.slider },
  { value: RankDto, name: FieldType.rank },
  { value: TextDto, name: FieldType.text },
];
