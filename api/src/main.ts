import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';

// fastify is used instead of express because it is faster
// see : https://docs.nestjs.com/techniques/performance
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // This is a global pipe that will be applied to all routes.
  // See : https://docs.nestjs.com/techniques/validation#auto-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // This will enable the shutdown hooks for the application.
  // It is used by Kubernetes to gracefully shutdown the application.
  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
