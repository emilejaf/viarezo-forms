import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { AbstractAnswerDto } from 'src/abstract-forms/dto/answer.dto';

export class PapsAnswerDto extends AbstractAnswerDto {
  @Expose({ name: 'paps_choice_id', toPlainOnly: true })
  @Type(() => Number)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  choiceId: number;
}
