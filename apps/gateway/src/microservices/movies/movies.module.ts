import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MOVIES_PACKAGE_NAME,
  MOVIES_SERVICE_NAME,
  USERS_PACKAGE_NAME,
  USERS_SERVICE_NAME,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MOVIES_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: MOVIES_PACKAGE_NAME,
            protoPath: join(__dirname, '../movies.proto'),
            url: configService.getOrThrow<string>('MOVIES_GRPC_URI'),
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
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
