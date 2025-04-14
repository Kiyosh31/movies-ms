import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NOTIFICATIONS_QUEUE } from '@app/common';
import { Logger } from 'nestjs-pino';

const serviceName = 'Notifications';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');

  const msApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
        queue: NOTIFICATIONS_QUEUE,
      },
    },
  );

  await msApp.listen();
  console.log(`[Service ${serviceName}] running on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start ${serviceName} service:`, err);
  process.exit(1);
});
