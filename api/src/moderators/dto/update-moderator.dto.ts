import { IsArray, IsString } from 'class-validator';

export class UpdateModeratorDto {
  @IsArray()
  @IsString({ each: true })
  moderatorLogins: string[];
}
