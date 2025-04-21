import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PAYMENTS_QUEUE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PaymentsModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  const msApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
        queue: PAYMENTS_QUEUE,
      },
    },
  );

  await msApp.listen();
  console.log(`[Service Payments] running`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start Notifications service:`, err);
  process.exit(1);
});
