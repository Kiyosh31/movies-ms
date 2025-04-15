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
import { CreateMovieRequest, Role, UpdateMovieRequest } from '@app/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createMovieDto: CreateMovieRequest) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.moviesService.getMovie(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateMovie(
    @Param('id') id: string,
    @Body() updateMovieRequest: UpdateMovieRequest,
  ) {
    updateMovieRequest.id = id;
    return this.moviesService.updateMovie(updateMovieRequest);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(id);
  }
}
