import { Module } from '@nestjs/common';
import { CotizService } from './cotiz.service';
import { LinkCSService } from './linkcs.service';
import { ViarezoController } from './viarezo.controller';

@Module({
  providers: [CotizService, LinkCSService],
  exports: [CotizService, LinkCSService],
  controllers: [ViarezoController],
})
export class ViarezoModule {}
