import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AbstractFormDto } from 'src/abstract-forms/dto/abstract-form.dto';
import { AccessType } from 'src/access/access';

export class FormDto extends AbstractFormDto {
  @IsOptional()
  @IsEnum(AccessType)
  access?: AccessType;

  @IsOptional()
  @IsString()
  accessMeta?: string;

  @IsOptional()
  @IsBoolean()
  anonym?: boolean;

  @IsOptional()
  @IsBoolean()
  uniqueAnswer?: boolean;
}
