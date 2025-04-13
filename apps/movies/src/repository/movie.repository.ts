import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDocument } from '../models/movie.schema';

@Injectable()
export class MovieRepository extends AbstractRepository<MovieDocument> {
  protected readonly logger = new Logger(MovieRepository.name);

  constructor(
    @InjectModel(MovieDocument.name) movieModel: Model<MovieDocument>,
  ) {
    super(movieModel);
  }
}
