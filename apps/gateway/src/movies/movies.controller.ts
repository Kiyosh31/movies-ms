import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieRequest, UpdateMovieRequest } from '@app/common';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieRequest) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.moviesService.getMovie(id);
  }

  @Patch(':id')
  updateMovie(
    @Param('id') id: string,
    @Body() updateMovieRequest: UpdateMovieRequest,
  ) {
    updateMovieRequest.id = id;
    return this.moviesService.updateMovie(updateMovieRequest);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }
}
