import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './auth/auth.guard';
import { CryptoModule } from './crypto/crypto.module';
import { VotesModule } from './votes/votes.module';
import { AbstractFormsModule } from './abstract-forms/abstract-forms.module';
import { FormsModule } from './forms/forms.module';
import { PapsModule } from './paps/paps.module';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    HealthModule,
    AbstractFormsModule,
    FormsModule,
    PapsModule,
    VotesModule,
    PrismaModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useExisting: AuthGuard,
    },
    AuthGuard,
    AppService,
  ],
})
export class AppModule {}
