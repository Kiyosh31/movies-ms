import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './repository/cards.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, LoggerModule, NOTIFICATIONS_QUEUE } from '@app/common';
import { CardDocument, CardSchema } from './models/card.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
