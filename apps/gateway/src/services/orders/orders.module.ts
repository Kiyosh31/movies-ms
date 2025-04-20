import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CARDS_PACKAGE_NAME,
  CARDS_SERVICE_NAME,
  ORDERS_PACKAGE_NAME,
  ORDERS_SERVICE_NAME,
  USERS_PACKAGE_NAME,
  USERS_SERVICE_NAME,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: ORDERS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: ORDERS_PACKAGE_NAME,
            protoPath: join(__dirname, '../orders.proto'),
            url: configService.getOrThrow<string>('ORDERS_GRPC_URI'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: USERS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: USERS_PACKAGE_NAME,
            protoPath: join(__dirname, '../users.proto'),
            url: configService.getOrThrow<string>('USERS_GRPC_URI'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: CARDS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: CARDS_PACKAGE_NAME,
            protoPath: join(__dirname, '../cards.proto'),
            url: configService.getOrThrow<string>('CARDS_GRPC_URI'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
