import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT_CREATE_NOTIFICATION } from '@app/common';
import { CreateNotificationDto } from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(EVENT_CREATE_NOTIFICATION)
  async handleCreateNotification(@Payload() data: CreateNotificationDto) {
    await this.notificationsService.createNotification(data);
  }
}
