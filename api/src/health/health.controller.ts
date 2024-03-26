import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get('liveness')
  @HealthCheck()
  async checkLiveness() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        'forms-api': { status: 'up' },
      }),
    ]);
  }

  @Public()
  @Get('readiness')
  @HealthCheck()
  async checkReadiness() {
    return this.health.check([
      async () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
