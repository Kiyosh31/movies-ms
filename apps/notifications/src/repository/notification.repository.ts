import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDocument } from '../models/notifications.schema';

@Injectable()
export class NotificationRepository extends AbstractRepository<NotificationDocument> {
  protected readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectModel(NotificationDocument.name)
    movieModel: Model<NotificationDocument>,
  ) {
    super(movieModel);
  }
}
