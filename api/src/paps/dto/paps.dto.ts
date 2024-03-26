import {
  IsNumber,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AbstractFormDto } from 'src/abstract-forms/dto/abstract-form.dto';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { AccessType } from 'src/access/access';

class PapsChoiceDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  size: number;
}

export class PapsDto extends AbstractFormDto {
  @IsOptional()
  @Expose({ name: 'papsStart', toPlainOnly: true }) // see https://github.com/typestack/class-transformer#exposing-properties-with-different-names
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  start?: Date;

  // only a subset of access are valid for paps
  @IsOptional()
  @IsIn([
    AccessType.ASSO,
    AccessType.ADVANCED,
    AccessType.CS,
    AccessType.PROMO,
    AccessType.RESTRICTED,
  ])
  access?: AccessType;

  @IsOptional()
  @IsString()
  accessMeta?: string;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PapsChoiceDto)
  choices?: PapsChoiceDto[];

  buildPrismaPapsChoices(
    id: string,
  ): Prisma.PapsChoiceUpdateManyWithoutFormNestedInput | undefined {
    if (!this.choices) return undefined;

    const newChoices = this.choices.filter((choice) => choice.id == null);
    const updatedChoices = this.choices.filter((choice) => choice.id != null);

    return {
      deleteMany: {
        papsId: {
          equals: id,
        },
        id: {
          notIn: updatedChoices.map((choice) => choice.id as number),
        },
      },
      createMany: {
        data: newChoices,
      },
      update: updatedChoices.map((choice) => ({
        where: {
          id: choice.id as number,
          papsId: id,
        },
        data: choice,
      })),
    };
  }
}
