import { Module, forwardRef } from '@nestjs/common';
import { FormUtilityService } from './form-utility.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ModeratorsModule } from 'src/moderators/moderators.module';
import { ViarezoModule } from 'src/viarezo/viarezo.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ModeratorsModule), ViarezoModule],
  providers: [FormUtilityService],
  exports: [FormUtilityService, PrismaModule],
})
export class AbstractFormsModule {}
