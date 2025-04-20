import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationDocument } from './models/notifications.schema';
import { CreateNotificationDto } from '@app/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification({
    userId,
    message,
    data,
  }: CreateNotificationDto): Promise<void> {
    await this.notificationRepository.create({
      userId,
      message,
      data,
    } as Omit<NotificationDocument, '_id'>);
  }
}
