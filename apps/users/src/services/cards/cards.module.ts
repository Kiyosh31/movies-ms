import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './repository/cards.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CARDS_PACKAGE_NAME,
  CARDS_SERVICE_NAME,
  DatabaseModule,
  LoggerModule,
  NOTIFICATIONS_QUEUE,
  NOTIFICATIONS_QUEUE_SERVICE,
  USERS_PACKAGE_NAME,
  USERS_SERVICE_NAME,
} from '@app/common';
import { CardDocument, CardSchema } from './models/card.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CardDocument.name, schema: CardSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_QUEUE_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: NOTIFICATIONS_QUEUE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
