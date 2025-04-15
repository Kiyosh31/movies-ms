import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from '../models/orders.schema';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  protected readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectModel(OrderDocument.name) movieModel: Model<OrderDocument>,
  ) {
    super(movieModel);
  }
}
