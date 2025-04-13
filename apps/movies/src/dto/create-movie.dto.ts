import { CreateMovieRequest } from '@app/common';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateMovieDto implements CreateMovieRequest {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsString()
  actors: string[];

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}
