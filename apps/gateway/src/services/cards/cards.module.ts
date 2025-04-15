import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CARDS_PACKAGE_NAME,
  CARDS_SERVICE_NAME,
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
  providers: [CardsService],
})
export class CardsModule {}
