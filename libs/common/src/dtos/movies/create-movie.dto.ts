import { CreateMovieRequest } from '@app/common';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  actors: string[];

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
