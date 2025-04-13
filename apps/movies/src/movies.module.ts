import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DatabaseModule,
  MOVIES_PACKAGE_NAME,
  MOVIES_SERVICE_NAME,
} from '@app/common';
import { MovieDocument, MovieSchema } from './models/movie.schema';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MovieDocument.name, schema: MovieSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: MOVIES_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: MOVIES_PACKAGE_NAME,
            protoPath: join(__dirname, '../movies.proto'),
            url: configService.getOrThrow<string>('GRPC_URI'),
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
