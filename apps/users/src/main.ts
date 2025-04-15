import { NestFactory } from '@nestjs/core';

import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CARDS_PACKAGE_NAME, USERS_PACKAGE_NAME } from '@app/common';
import { Logger } from 'nestjs-pino';
import { UsersModule } from './services/users/users.module';
import { CardsModule } from './services/cards/cards.module';

async function bootstrap() {
  // Users Microservice
  const usersApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.GRPC,
      options: {
        package: USERS_PACKAGE_NAME,
        protoPath: join(__dirname, '../users.proto'), // Adjust path
        url: process.env.USERS_GRPC_URI || 'localhost:5001', // Use env var
      },
    },
  );

  usersApp.useLogger(usersApp.get(Logger));
  await usersApp.listen();
  console.log(
    `[Service Users] is listening on port ${process.env.USERS_GRPC_URI || 'localhost:5001'}`,
  );

  // Cards Microservice
  const cardsApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    CardsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: CARDS_PACKAGE_NAME,
        protoPath: join(__dirname, '../cards.proto'), // Adjust path
        url: process.env.CARDS_GRPC_URI || 'localhost:5002', // Use env var
      },
    },
  );
  cardsApp.useLogger(cardsApp.get(Logger));
  await cardsApp.listen();
  console.log(
    `[Service Cards] is listening on port ${process.env.CARDS_GRPC_URI || 'localhost:5002'}`,
  );
}

bootstrap().catch((err) => {
  console.error(`Failed to start service:`, err);
  process.exit(1);
});
