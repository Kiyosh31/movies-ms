import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  LoggerModule,
  DatabaseModule,
  PAYMENTS_QUEUE,
  NOTIFICATIONS_QUEUE,
} from '@app/common';
import { OrderDocument, OrderSchema } from './models/orders.schema';
import { OrderRepository } from './repository/orders.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_QUEUE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: NOTIFICATIONS_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_QUEUE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: PAYMENTS_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
