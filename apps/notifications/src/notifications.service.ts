import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationDocument } from './models/notifications.schema';

interface EventPayload {
  id: string;
  [key: string]: any; // Allow other properties in the payload
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  private async createNotification(
    userId: string,
    message: string,
    data: any,
  ): Promise<void> {
    await this.notificationRepository.create({
      userId,
      message,
      data,
    } as Omit<NotificationDocument, '_id'>);
  }

  async handleUserCreated(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'user created successfully', data);
  }

  async handleUserUpdated(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'user updated successfully', data);
  }

  async handleUserDeleted(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'user deleted successfully', data);
  }

  async handleMovieCreated(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'movie created successfully', data);
  }

  async handleMovieUpdated(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'movie updated successfully', data);
  }

  async handleMovieDeleted(data: EventPayload): Promise<void> {
    await this.createNotification(data.id, 'movie deleted successfully', data);
  }
}
