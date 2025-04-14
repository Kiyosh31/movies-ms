import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { MovieDocument, MovieSchema } from './models/movie.schema';
import { MovieRepository } from './repository/movie.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MovieDocument.name, schema: MovieSchema },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
})
export class MoviesModule {}
