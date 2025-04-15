import {
  CreateMovieRequest,
  DeleteMovieResponse,
  EVENT_CREATED_MOVIE,
  EVENT_DELETED_MOVIE,
  EVENT_UPDATED_MOVIE,
  Movie,
  NOTIFICATIONS_QUEUE_SERVICE,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MovieRepository } from './repository/movie.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { MovieDocument } from './models/movie.schema';
import { UpdateMovieDto } from 'apps/gateway/src/services/movies/dto/update-movie.dto';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(
    private readonly movieRepository: MovieRepository,
    @Inject(NOTIFICATIONS_QUEUE_SERVICE) private rabbitMqClient: ClientProxy,
  ) {}

  onModuleInit() {}

  mapMovieDocumentToMovie(movieDocument: MovieDocument): Movie {
    return {
      id: movieDocument._id.toString(),
      title: movieDocument.title,
      actors: movieDocument.actors,
      director: movieDocument.director,
      genre: movieDocument.genre,
      rating: movieDocument.rating,
      year: movieDocument.year,
      price: movieDocument.price,
    };
  }

  async movieExists(title: string) {
    try {
      await this.movieRepository.findOne({ title });
    } catch (e) {
      return;
    }
    throw new RpcException({
      code: status.ALREADY_EXISTS,
      message: 'Movie already exists',
    });
  }

  async createMovie(createMovieDto: CreateMovieRequest): Promise<Movie> {
    try {
      await this.movieExists(createMovieDto.title);

      const createdMovie = await this.movieRepository.create(
        createMovieDto as Omit<MovieDocument, '_id'>,
      );

      this.rabbitMqClient.emit(
        EVENT_CREATED_MOVIE,
        this.mapMovieDocumentToMovie(createdMovie),
      );

      return this.mapMovieDocumentToMovie(createdMovie);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async getMovie(_id: string): Promise<Movie> {
    try {
      const foundMovie = await this.movieRepository.findOne({ _id });
      if (!foundMovie) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: 'Movie not found',
        });
      }

      return this.mapMovieDocumentToMovie(foundMovie);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async updateMovie(updateMovieDto: UpdateMovieDto, _id: string) {
    try {
      const updatedMovie = await this.movieRepository.findOneAndUpdate(
        { _id },
        { $set: updateMovieDto },
      );

      this.rabbitMqClient.emit(
        EVENT_UPDATED_MOVIE,
        this.mapMovieDocumentToMovie(updatedMovie),
      );

      return this.mapMovieDocumentToMovie(updatedMovie);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  async deleteMovie(_id: string): Promise<DeleteMovieResponse> {
    try {
      await this.movieRepository.findOneAndDelete({ _id });

      this.rabbitMqClient.emit(EVENT_DELETED_MOVIE, { data: { id: _id } });

      return {};
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
