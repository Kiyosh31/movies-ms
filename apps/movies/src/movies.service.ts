import {
  CreateMovieRequest,
  CreateNotificationDto,
  DeleteMovieResponse,
  EVENT_CREATE_NOTIFICATION,
  Movie,
  NOTIFICATIONS_QUEUE,
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
    @Inject(NOTIFICATIONS_QUEUE) private rabbitMqClient: ClientProxy,
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

      const rabbitMqPayload: CreateNotificationDto = {
        userId: 'asd',
        message: 'Movie created',
        data: this.mapMovieDocumentToMovie(createdMovie),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

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

      const rabbitMqPayload: CreateNotificationDto = {
        userId: updatedMovie._id.toHexString(),
        message: 'Movie updated',
        data: this.mapMovieDocumentToMovie(updatedMovie),
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

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
      const deletedMovie = await this.movieRepository.findOneAndDelete({ _id });

      const rabbitMqPayload: CreateNotificationDto = {
        userId: deletedMovie._id.toHexString(),
        message: 'Movie deleted',
        data: null,
      };
      this.rabbitMqClient.emit(EVENT_CREATE_NOTIFICATION, rabbitMqPayload);

      return {};
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
