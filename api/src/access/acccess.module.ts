import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { ViarezoModule } from 'src/viarezo/viarezo.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { FormsModule } from 'src/forms/forms.module';
import { PapsModule } from 'src/paps/paps.module';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  imports: [
    PrismaModule,
    ViarezoModule,
    CryptoModule,
    FormsModule,
    PapsModule,
    MailingModule,
  ],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
