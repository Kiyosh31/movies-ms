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
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
