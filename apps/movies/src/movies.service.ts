import { DeleteMovieResponse, Movie } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MovieRepository } from './repository/movie.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService implements OnModuleInit {
  constructor(private readonly movieRepository: MovieRepository) {}

  onModuleInit() {}

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

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      await this.movieExists(createMovieDto.title);

      const createdMovie = await this.movieRepository.create(createMovieDto);

      return {
        id: createdMovie._id.toString(),
        title: createdMovie.title,
        actors: createdMovie.actors,
        director: createdMovie.director,
        genre: createdMovie.genre,
        rating: createdMovie.rating,
        year: createdMovie.year,
      };
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

      return {
        id: foundMovie._id.toString(),
        title: foundMovie.title,
        actors: foundMovie.actors,
        director: foundMovie.director,
        genre: foundMovie.genre,
        rating: foundMovie.rating,
        year: foundMovie.year,
      };
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

      return {
        id: updatedMovie._id.toString(),
        title: updatedMovie.title,
        actors: updatedMovie.actors,
        director: updatedMovie.director,
        genre: updatedMovie.genre,
        rating: updatedMovie.rating,
        year: updatedMovie.year,
      };
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

      return {};
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
