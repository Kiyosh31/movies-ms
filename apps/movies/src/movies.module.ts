import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  LoggerModule,
  NOTIFICATIONS_QUEUE,
  NOTIFICATIONS_QUEUE_SERVICE,
} from '@app/common';
import { MovieDocument, MovieSchema } from './models/movie.schema';
import { MovieRepository } from './repository/movie.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MovieDocument.name, schema: MovieSchema },
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
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
})
export class MoviesModule {}
