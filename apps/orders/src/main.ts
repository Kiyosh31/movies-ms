import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { OrdersModule } from './orders.module';
import { ORDERS_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const url = configService.getOrThrow<string>('GRPC_URI');

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
      transport: Transport.GRPC,
      options: {
        package: ORDERS_PACKAGE_NAME,
        protoPath: join(__dirname, '../orders.proto'),
        url,
      },
    });

  await microserviceApp.listen();
  console.log(`[Service Orders] is listening on port ${url}`);
}

bootstrap().catch((err) => {
  console.error(`Failed to start Orders service:`, err);
  process.exit(1);
});
