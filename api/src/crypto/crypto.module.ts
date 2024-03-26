import { Module } from '@nestjs/common';
import { AsymetricService } from './asymetric.service';
import { SigningService } from './signing.service';
import { SymetricService } from './symetric.service';

@Module({
  providers: [AsymetricService, SigningService, SymetricService],
  exports: [AsymetricService, SigningService, SymetricService],
})
export class CryptoModule {}
