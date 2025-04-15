import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Role, UpdateMovieRequest } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CreateMovieDto } from 'apps/gateway/src/services/movies/dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService
      .createMovie(createMovieDto)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.moviesService
      .getMovie(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    const updateMovieRequest: UpdateMovieRequest = {
      ...updateMovieDto,
      actors: updateMovieDto.actors || [],
      id,
    };

    return this.moviesService
      .updateMovie(updateMovieRequest)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteMovie(@Param('id') id: string) {
    return this.moviesService
      .deleteMovie(id)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}
