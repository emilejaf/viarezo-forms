import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ModeratorsController } from './moderators.controller';
import { ModeratorsService } from './moderators.service';
import { AbstractFormsModule } from 'src/abstract-forms/abstract-forms.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AbstractFormsModule)],
  controllers: [ModeratorsController],
  providers: [ModeratorsService],
  exports: [ModeratorsService],
})
export class ModeratorsModule {}
