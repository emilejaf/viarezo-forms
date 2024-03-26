import { Module, forwardRef } from '@nestjs/common';
import { AbstractFormsModule } from 'src/abstract-forms/abstract-forms.module';
import { PapsService } from './paps.service';
import { PapsController } from './paps.controller';
import { AccessModule } from 'src/access/acccess.module';
import { ModeratorsModule } from 'src/moderators/moderators.module';

@Module({
  imports: [
    AbstractFormsModule,
    forwardRef(() => AccessModule),
    ModeratorsModule,
  ],
  providers: [PapsService],
  controllers: [PapsController],
  exports: [PapsService],
})
export class PapsModule {}
