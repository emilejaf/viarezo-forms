import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { AbstractFormsModule } from 'src/abstract-forms/abstract-forms.module';
import { AccessModule } from 'src/access/acccess.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { ModeratorsModule } from 'src/moderators/moderators.module';
import { MailingModule } from 'src/mailing/mailing.module';
import { VotersController } from './voters.controller';
import { VotersService } from './voters.service';

@Module({
  imports: [
    AbstractFormsModule,
    AccessModule,
    CryptoModule,
    ModeratorsModule,
    MailingModule,
  ],
  controllers: [VotesController, VotersController],
  providers: [VotesService, VotersService],
})
export class VotesModule {}
