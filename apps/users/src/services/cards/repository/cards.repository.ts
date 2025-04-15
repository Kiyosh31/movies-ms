import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardDocument } from '../models/card.schema';

@Injectable()
export class CardsRepository extends AbstractRepository<CardDocument> {
  protected readonly logger = new Logger(CardsRepository.name);

  constructor(@InjectModel(CardDocument.name) userModel: Model<CardDocument>) {
    super(userModel);
  }
}
