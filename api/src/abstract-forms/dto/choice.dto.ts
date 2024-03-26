import { IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class ChoiceDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @ValidateIf((data) => data == null || typeof data == 'string')
  data?: string | null;
}
