import { Controller } from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  CreateMovieRequest,
  DeleteMovieRequest,
  GetMovieRequest,
  MoviesServiceController,
  MoviesServiceControllerMethods,
  UpdateMovieRequest,
} from '@app/common';

@Controller('movies')
@MoviesServiceControllerMethods()
export class MoviesController implements MoviesServiceController {
  constructor(private readonly moviesService: MoviesService) {}

  createMovie(request: CreateMovieRequest) {
    return this.moviesService.createMovie(request);
  }

  getMovie(request: GetMovieRequest) {
    return this.moviesService.getMovie(request.id);
  }

  updateMovie(request: UpdateMovieRequest) {
    return this.moviesService.updateMovie(request, request.id);
  }

  deleteMovie(request: DeleteMovieRequest) {
    return this.moviesService.deleteMovie(request.id);
  }
}
