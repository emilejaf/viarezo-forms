import { Module, forwardRef } from '@nestjs/common';
import { AbstractFormsModule } from 'src/abstract-forms/abstract-forms.module';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { AccessModule } from 'src/access/acccess.module';
import { ModeratorsModule } from 'src/moderators/moderators.module';

@Module({
  imports: [
    AbstractFormsModule,
    forwardRef(() => AccessModule),
    ModeratorsModule,
  ],
  providers: [FormsService],
  controllers: [FormsController],
  exports: [FormsService],
})
export class FormsModule {}
