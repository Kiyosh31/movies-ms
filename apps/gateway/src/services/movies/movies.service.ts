import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateMovieRequest,
  MOVIES_SERVICE_NAME,
  MoviesServiceClient,
  UpdateMovieRequest,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class MoviesService implements OnModuleInit {
  private moviesService: MoviesServiceClient;

  constructor(@Inject(MOVIES_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.moviesService =
      this.client.getService<MoviesServiceClient>(MOVIES_SERVICE_NAME);
  }

  createMovie(createMovieRequest: CreateMovieRequest) {
    return this.moviesService.createMovie(createMovieRequest);
  }

  getMovie(id: string) {
    return this.moviesService.getMovie({ id });
  }

  updateMovie(updateMovieRequest: UpdateMovieRequest) {
    return this.moviesService.updateMovie(updateMovieRequest);
  }

  deleteMovie(id: string) {
    return this.moviesService.deleteMovie({ id });
  }
}
