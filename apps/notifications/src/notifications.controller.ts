import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EVENT_CREATED_USER } from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(EVENT_CREATED_USER)
  async handleUserCreated(@Payload() data: any) {
    await this.notificationsService.handleUserCreated(data);
  }
}
