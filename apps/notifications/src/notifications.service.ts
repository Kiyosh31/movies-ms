import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationDocument } from './models/notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async handleUserCreated(data: any) {
    await this.notificationRepository.create({
      userId: data.id,
      message: 'user created succesfully',
      data,
    } as Omit<NotificationDocument, '_id'>);
  }
}
