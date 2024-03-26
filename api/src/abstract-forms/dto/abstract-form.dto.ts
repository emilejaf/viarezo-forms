import { FieldDto, subTypes } from './field.dto';
import { Type, instanceToPlain } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Prisma } from '@prisma/client';

export abstract class AbstractFormDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  backgroundUrl?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ValidateNested({ each: true })
  @Type(() => FieldDto, {
    discriminator: {
      property: 'type',
      // @ts-expect-error subTypes is not a valid property of the discriminator because I want to use undefined as a default type
      subTypes: subTypes,
    },
    keepDiscriminatorProperty: false,
  })
  fields?: FieldDto[];

  buildPrimaFields(
    id: string,
  ): Prisma.FieldUpdateManyWithoutFormNestedInput | undefined {
    if (!this.fields) return undefined;

    const newFields = this.fields.filter((field) => field.id == null);
    const updatedFields = this.fields.filter((field) => field.id != null);

    return {
      deleteMany: {
        formId: {
          equals: id,
        },
        id: {
          notIn: updatedFields.map((field) => field.id as string),
        },
      },
      createMany: {
        data: newFields.map((field) => field.buildPrismaCreateField()),
      },
      update: updatedFields.map((field) => ({
        where: {
          id_formId: {
            formId: id,
            id: field.id as string,
          },
        },
        data: field.buildPrismaUpdateField(id),
      })),
    };
  }

  toPlain() {
    return instanceToPlain(this);
  }
}
